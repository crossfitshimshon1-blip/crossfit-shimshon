/** @type {import('tailwindcss').Config}
 * Production build of the exact same theme the runtime CDN used to generate.
 * Compiled to assets/tailwind.css so no third-party script runs on visitors.
 * Rebuild after editing markup:
 *   npx tailwindcss@3.4.17 -c tailwind.config.js -i tw-input.css -o assets/tailwind.css --minify
 */
module.exports = {
  content: ['./index.html', './team.html', './terms.html', './accessibility.html'],
  // Classes toggled only from JS strings — keep them even if the scanner is unsure.
  safelist: [
    'hidden',
    'border-red-500',
    'text-red-400',
    'text-red-500',
    'text-accent',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        'primary-light': '#FB923C',
        'primary-dark': '#EA580C',
        accent: '#22C55E',
        ink: '#0B0F14',
        surface: '#121922',
        'surface-2': '#1A2230',
        'surface-3': '#222C3A',
        line: '#283341',
        'muted-fg': '#9AA8B8',
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
