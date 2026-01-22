import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Baskerville', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                skin: {
                    base: 'var(--bg-primary)',
                    'text-main': 'var(--text-primary)',
                    'text-secondary': 'var(--text-secondary)',
                    'card-bg': 'var(--card-bg)',
                    'card-border': 'var(--card-border)',
                }
            }
        },
    },

    darkMode: "class",
    plugins: [
        forms,
        heroui()
    ],
};
