/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                glass: {
                    surface: 'rgba(0, 0, 0, 0.30)',
                    border: 'rgba(255, 255, 255, 0.10)',
                    highlight: 'rgba(255, 255, 255, 0.20)',
                    glow: 'rgba(255, 255, 255, 0.05)',
                },
                verdict: {
                    real: '#22C55E',
                    ai: '#EF4444',
                    scanning: '#3B82F6',
                },
            },
            fontFamily: {
                sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
            },
            backdropBlur: {
                glass: '24px',
            },
            backdropSaturate: {
                glass: '180%',
            },
            backdropBrightness: {
                glass: '120%',
            },
            animation: {
                'glass-in': 'glassIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'scanner': 'scanner 1.5s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
            },
            keyframes: {
                glassIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.9) translateY(10px)',
                        filter: 'blur(10px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1) translateY(0)',
                        filter: 'blur(0)',
                    },
                },
                scanner: {
                    '0%': {
                        top: '0%',
                        opacity: '0.5',
                    },
                    '50%': {
                        opacity: '1',
                    },
                    '100%': {
                        top: '100%',
                        opacity: '0.5',
                    },
                },
                pulseGlow: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
                    },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            boxShadow: {
                'glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
                'glass-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 0 12px 40px rgba(0, 0, 0, 0.5)',
            },
        },
    },
    plugins: [],
}
