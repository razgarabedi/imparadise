/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        'background-muted': 'var(--color-background-muted)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-muted': 'var(--color-accent-muted)',
        success: 'var(--color-success)',
        'success-emphasis': 'var(--color-success-emphasis)',
        'success-emphasis-hover': 'var(--color-success-emphasis-hover)',
        danger: 'var(--color-danger)',
        'danger-hover': 'var(--color-danger-hover)',
        'danger-muted': 'var(--color-danger-muted)',
        warning: 'var(--color-warning)',
        overlay: 'var(--color-overlay)',
      },
      minHeight: {
        'screen-minus-nav': 'calc(100vh - 64px)', // Assuming a 64px tall navbar
      },
      ringOffsetColor: {
        'background': 'var(--color-background)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 