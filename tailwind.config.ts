import type { Config } from 'tailwindcss'
export default {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} as Config
