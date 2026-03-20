import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          ws: true,
          secure: false,
        }
      }
    },
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return;
            }

            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
              return 'editor';
            }

            if (id.includes('@tensorflow-models/blazeface')) {
              return 'blazeface';
            }

            if (id.includes('face-api.js')) {
              return 'face-api';
            }

            if (id.includes('@tensorflow')) {
              return 'tensorflow';
            }

            if (id.includes('firebase')) {
              return 'firebase';
            }

            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts';
            }

            if (id.includes('react-simple-code-editor') || id.includes('prismjs')) {
              return 'code-tools';
            }

            if (id.includes('@stomp/stompjs') || id.includes('sockjs-client')) {
              return 'realtime';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (id.includes('/react/') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }

            if (id.includes('@google/genai') || id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'ai';
            }

            return 'vendor';
          },
        },
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
