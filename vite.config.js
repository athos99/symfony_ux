import { defineConfig } from 'vite';
import Symfony from '@symfony/reprise/vite';

export default defineConfig({
    input: {
        app: './assets/app.js',
    },
    plugins: [
        Symfony({
            devServerOrigin: 'http://localhost:5173',
            stimulus: 'assets/controllers.json',
        }),
    ],
    server: {
        host: '0.0.0.0',
    },
});
