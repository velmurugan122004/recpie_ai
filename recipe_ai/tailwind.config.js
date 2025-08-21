/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* warm gray */
        input: "var(--color-input)", /* light warm gray */
        ring: "var(--color-ring)", /* deep forest green */
        background: "var(--color-background)", /* cream */
        foreground: "var(--color-foreground)", /* near-black */
        primary: {
          DEFAULT: "var(--color-primary)", /* deep forest green */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* warm saddle brown */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* controlled red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* light warm gray */
          foreground: "var(--color-muted-foreground)", /* medium gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* vibrant coral-orange */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* cream */
          foreground: "var(--color-popover-foreground)", /* near-black */
        },
        card: {
          DEFAULT: "var(--color-card)", /* light warm gray */
          foreground: "var(--color-card-foreground)", /* near-black */
        },
        success: {
          DEFAULT: "var(--color-success)", /* fresh green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* warm amber */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* controlled red */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Source Sans Pro', 'sans-serif'],
        'caption': ['Nunito Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'warm': '0 2px 8px rgba(45, 90, 39, 0.08)',
        'warm-md': '0 4px 12px rgba(45, 90, 39, 0.12)',
        'warm-lg': '0 8px 24px rgba(45, 90, 39, 0.16)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}