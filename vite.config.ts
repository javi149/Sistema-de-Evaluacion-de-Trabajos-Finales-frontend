import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.API_BACK || env.VITE_API_URL || 'https://sistema-de-evaluacion-de-trabajos-finales-production.up.railway.app';

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: true,
        },
      },
    },
  };
});
