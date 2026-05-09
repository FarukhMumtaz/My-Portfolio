import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Agar error aa raha hai toh ye block add kar sakte ho (Optional but helpful)
  define: {
    'process.env': {}
  }
})