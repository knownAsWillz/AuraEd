/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f4f9f2',
                    100: '#e5f2e1',
                    200: '#cae3c1',
                    300: '#a3cd96',
                    400: '#90c282', // Base brand color from logo
                    500: '#62a251',
                    600: '#4a823b',
                    700: '#3a662f',
                    800: '#315229',
                    900: '#294423',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
