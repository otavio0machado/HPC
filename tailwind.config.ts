import type { Config } from 'tailwindcss';

export default {
    darkMode: 'class',
    content: [
        './index.html',
        './*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './services/**/*.{js,ts,jsx,tsx}',
    ],
} satisfies Config;
