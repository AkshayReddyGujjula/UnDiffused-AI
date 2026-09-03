/**
 * URL admission control for the background service worker.
 *
 * Split out of main.ts so it can be tested without a chrome runtime. This is a
 * security boundary: the background worker holds host permissions for every
 * http(s) origin, so its fetch is bound by neither CORS nor the page's own
 * origin, and the URL it is asked to fetch comes from whatever image the user
 * right-clicked, which the page controls completely.
 *
 * See tests/urlguard.test.mjs.
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'data:', 'blob:']);

/**
 * Hostnames the background worker refuses to fetch.
 *
 * The background worker holds host permissions for every http(s) origin, so its
 * fetch is not bound by CORS or by the page's own origin. The URL it fetches
 * comes from whatever image the user right-clicked, and a page controls that
 * completely. Without this guard a page could embed an image pointing at the
 * loopback interface, the LAN, or a cloud instance-metadata endpoint, and a
 * single right-click would fetch it with the extension's privileges and hand
 * the bytes back into the page's own context.
 *
 * The extension only ever needs to fetch publicly routable images, so refusing
 * the private ranges outright costs nothing.
 */
const BLOCKED_HOSTNAMES = new Set([
    'localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]',
    'metadata.google.internal',
]);

/**
 * Parse a hostname as an IPv4 literal in any form the URL parser accepts.
 *
 * A regex over the dotted-decimal spelling is not enough. `http://2130706433/`
 * and `http://0x7f000001/` are both 127.0.0.1, and the browser resolves them
 * happily, so a guard that only recognises "127." lets loopback straight
 * through. Parts may be decimal, octal (leading zero) or hex (leading 0x), and
 * a short form lets the final part absorb the remaining bytes, so 127.1 is also
 * loopback.
 *
 * Returns the address as an unsigned 32-bit number, or null if the hostname is
 * not an IPv4 literal at all (an ordinary DNS name).
 */
function ipv4ToLong(host: string): number | null {
    const parts = host.split('.');
    if (parts.length === 0 || parts.length > 4) return null;

    const nums: number[] = [];
    for (const raw of parts) {
        if (raw === '') return null;
        let n: number;
        if (/^0x[0-9a-f]+$/i.test(raw)) n = parseInt(raw.slice(2), 16);
        else if (/^0[0-7]+$/.test(raw)) n = parseInt(raw.slice(1), 8);
        else if (/^\d+$/.test(raw)) n = parseInt(raw, 10);
        else return null;
        if (!Number.isFinite(n) || n < 0) return null;
        nums.push(n);
    }

    const last = nums.pop();
    if (last === undefined) return null;
    if (last >= Math.pow(256, 4 - nums.length)) return null;
    let value = last;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 255) return null;
        value += nums[i] * Math.pow(256, 3 - i);
    }
    return value >>> 0;
}

/** True for loopback, private, link-local, CGNAT and unspecified IPv4. */
function isPrivateIpv4(value: number): boolean {
    const a = value >>> 24;
    const ab = value >>> 16;
    if (a === 0 || a === 10 || a === 127) return true;      // 0/8, 10/8, 127/8
    if (ab === 0xa9fe) return true;                          // 169.254/16
    if (ab >= 0xac10 && ab <= 0xac1f) return true;           // 172.16/12
    if (ab === 0xc0a8) return true;                          // 192.168/16
    if (ab >= 0x6440 && ab <= 0x647f) return true;           // 100.64/10 CGNAT
    return false;
}

export function isBlockedHost(hostname: string): boolean {
    const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (BLOCKED_HOSTNAMES.has(host) || BLOCKED_HOSTNAMES.has(hostname.toLowerCase())) {
        return true;
    }

    // IPv4 in any spelling. Only applied when the hostname really parses as an
    // address, so a public domain that merely starts with digits, such as
    // 10.example.com, is not caught by it.
    const asIpv4 = ipv4ToLong(host);
    if (asIpv4 !== null) return isPrivateIpv4(asIpv4);

    // IPv6 loopback, unspecified, unique-local (fc00::/7) and link-local
    // (fe80::/10). Only a string containing a colon is an IPv6 literal.
    if (host.includes(':')) {
        // Anything beginning "::" sits in the reserved 0000::/8 block: the
        // unspecified address, loopback, and the IPv4-mapped and
        // IPv4-compatible ranges. None of it is globally routable, so refusing
        // the whole prefix is both safe and complete.
        //
        // Enumerating the forms individually is what fails. ::ffff:127.0.0.1
        // and ::ffff:7f00:1 are the same loopback address, the second written
        // with hex hextets and no dots, and Chrome's URL parser normalises to
        // whichever is shorter. A check that looked for an embedded dotted quad
        // saw no dot in the second form and let it through.
        if (host.startsWith('::')) return true;
        if (/^f[cd]/.test(host)) return true;          // fc00::/7 unique-local
        if (/^fe[89ab]/.test(host)) return true;       // fe80::/10 link-local
        return false;
    }

    if (host.endsWith('.localhost') || host.endsWith('.internal')) return true;
    return false;
}

export function isValidImageUrl(rawUrl: string): boolean {
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
        return true;
    }

    try {
        const parsed = new URL(rawUrl);
        if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return false;
        if (isBlockedHost(parsed.hostname)) return false;
        return true;
    } catch {
        return false;
    }
}
