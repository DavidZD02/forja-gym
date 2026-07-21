import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceder desde el celular en la misma red durante desarrollo
    port: 5173
  }
})
