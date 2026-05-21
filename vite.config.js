import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function serveDemosPlugin() {
  return {
    name: 'serve-demos',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/demos/') && !req.url.includes('.')) {
          const parts = req.url.split('/');
          if (parts.length >= 3 && parts[2]) {
            req.url = `/demos/${parts[2]}/index.html`;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    serveDemosPlugin(),
  ],
  assetsInclude: ['**/*.glb'],
})
