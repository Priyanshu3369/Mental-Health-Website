import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  extend: {
  colors: {
    calming: {
      light: "#E0F2F1",
      DEFAULT: "#80CBC4",
      dark: "#004D40",
    },
  },
},

})
