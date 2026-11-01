/** @type {import('tailwindcss').Config}
 * Production build of the exact same theme the runtime CDN used to generate.
 * Compiled to assets/tailwind.css so no third-party script runs on visitors.
 * Rebuild after editing markup:
 *   npx tailwindcss@3.4.17 -c tailwind.config.js -i tw-input.css -o assets/tailwind.css --minify
 */
module.exports = {
  content: ['./index.html', './team.html', './kids.html', './terms.html', './accessibility.html'],
  // Classes toggled only from JS strings — keep them even if the scanner is unsure.
  safelist: [
    'hidden',
    'border-red-500',
    'text-red-600',
    'text-red-500',
    'text-accent',
  ],
  theme: {
    extend: {
      colors: {
        // Logo palette: orange #F15A24 + navy #00005A, on a light page.
        primary: '#F15A24',
        'primary-light': '#F47B4E',
        'primary-dark': '#D9481A',
        ink: '#0E1030', // near-black navy: text on orange buttons
        // Theme tokens are CSS variables (set in each page's <style>): light by default,
        // navy/white inside .zone-dark (navbar, photo sections, footer).
        base: 'rgb(var(--c-base) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--c-surface-3) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'muted-fg': 'rgb(var(--c-muted) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        'fg-2': 'rgb(var(--c-fg-2) / <alpha-value>)',
        'fg-3': 'rgb(var(--c-fg-3) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'primary-fg': 'rgb(var(--c-primary-fg) / <alpha-value>)', // orange for text: darker on light so small text stays legible
        // The markup's stock orange/sky classes, re-pointed at the logo hues.
        orange: { 600: '#D9481A' },
        sky: { 200: 'rgb(var(--c-sky-200) / <alpha-value>)', 300: 'rgb(var(--c-sky-300) / <alpha-value>)', 400: 'rgb(var(--c-sky-400) / <alpha-value>)', 500: 'rgb(var(--c-sky-500) / <alpha-value>)' },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Heebo"', 'sans-serif'],
        body: ['"Assistant"', '"Barlow"', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
