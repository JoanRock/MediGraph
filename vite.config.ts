import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Canvia 'nom-del-repositori' pel nom REAL del teu repositori a GitHub
  // Exemple: si el repo és 'usuari/medigraph', posa '/medigraph/'
  base: '/medigraph/', 
})