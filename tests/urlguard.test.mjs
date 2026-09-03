/**
 * Tests for the background worker's URL admission control.
 *
 * This is a security boundary, so it is tested against the evasions that
 * actually get used rather than against the happy path. The background worker
 * has host permissions for every http(s) origin, which means its fetch is bound
 * by neither CORS nor the page's origin, and the URL it fetches comes from
 * whatever image the user right-clicked. A page controls that completely.
 *
 * The first version of this guard was a regex over the dotted-decimal spelling
 * of private ranges. It blocked "127.0.0.1" and let through "2130706433", which
 * is the same address written as a 32-bit integer, and it also blocked
 * "10.example.com", which is an ordinary public domain. Both directions are
 * covered below.
 *
 * Run: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { isBlockedHost, isValidImageUrl } from './urlguard.bundle.mjs';

test('loopback is blocked in every spelling the URL parser accepts', () => {
    for (const host of [
        'localhost', '127.0.0.1', '127.1', '127.000.000.001',
        '2130706433',        // 127.0.0.1 as a single decimal integer
        '0x7f000001',        // ... and as hex
        '0177.0.0.1',        // ... with an octal first octet
        '::1', '[::1]',
        'app.localhost',
    ]) {
        assert.equal(isBlockedHost(host), true, `${host} must be blocked`);
    }
});

test('private, link-local and metadata ranges are blocked', () => {
    for (const host of [
        '10.0.0.5', '10.255.255.255',
        '192.168.1.1',
        '172.16.0.1', '172.20.10.1', '172.31.255.254',
        '169.254.169.254',          // cloud instance metadata
        '100.64.0.1',               // CGNAT
        '0.0.0.0',
        'metadata.google.internal',
        'db8.internal',
        'fd00::1', 'fe80::1',
        '::ffff:127.0.0.1',         // IPv4-mapped loopback, dotted form
        '::ffff:7f00:1',            // the same address in hex hextets, no dots
        '::ffff:a00:1',             // IPv4-mapped 10.0.0.1
        '::',                       // unspecified
    ]) {
        assert.equal(isBlockedHost(host), true, `${host} must be blocked`);
    }
});

test('172.16/12 is bounded correctly at both ends', () => {
    assert.equal(isBlockedHost('172.15.255.255'), false);
    assert.equal(isBlockedHost('172.16.0.0'), true);
    assert.equal(isBlockedHost('172.31.255.255'), true);
    assert.equal(isBlockedHost('172.32.0.0'), false);
});

test('public hosts are not blocked, including ones that look numeric', () => {
    for (const host of [
        'example.com', 'images.unsplash.com', 'cdn.example.co.uk',
        '10.example.com',     // starts with a private prefix but is a DNS name
        '127.media.cdn.net',
        '8.8.8.8', '1.1.1.1',
        '93.184.216.34',
        '2606:2800:220:1:248:1893:25c8:1946',
    ]) {
        assert.equal(isBlockedHost(host), false, `${host} must be allowed`);
    }
});

test('isValidImageUrl rejects unsupported protocols', () => {
    assert.equal(isValidImageUrl('https://example.com/a.jpg'), true);
    assert.equal(isValidImageUrl('http://example.com/a.jpg'), true);
    assert.equal(isValidImageUrl('data:image/png;base64,iVBOR'), true);
    assert.equal(isValidImageUrl('blob:https://example.com/abc'), true);

    assert.equal(isValidImageUrl('file:///etc/passwd'), false);
    assert.equal(isValidImageUrl('javascript:alert(1)'), false);
    assert.equal(isValidImageUrl('chrome://settings'), false);
    assert.equal(isValidImageUrl('ftp://example.com/a.jpg'), false);
    assert.equal(isValidImageUrl('not a url at all'), false);
    assert.equal(isValidImageUrl(''), false);
});

test('isValidImageUrl applies the host guard, not just the protocol', () => {
    assert.equal(isValidImageUrl('http://169.254.169.254/latest/meta-data/'), false);
    assert.equal(isValidImageUrl('http://2130706433/admin'), false);
    assert.equal(isValidImageUrl('http://localhost:8899/model.onnx'), false);
    assert.equal(isValidImageUrl('http://[::1]:9000/x.png'), false);
});

test('data and blob URLs skip the host check by design', () => {
    // They carry their bytes with them, so there is no host to reach.
    assert.equal(isValidImageUrl('data:image/jpeg;base64,/9j/4AAQ'), true);
});
