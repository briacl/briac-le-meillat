import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'api-middleware',
            configureServer(server) {
                server.middlewares.use('/api/projects', async (req, res, next) => {
                    const fs = await import('fs/promises');
                    const dataPath = path.resolve(__dirname, './src/data/projects.json');

                    if (req.method === 'GET') {
                        try {
                            const data = await fs.readFile(dataPath, 'utf-8');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(data);
                        } catch (err) {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: 'Failed to read data' }));
                        }
                    } else if (req.method === 'POST') {
                        let body = '';
                        req.on('data', chunk => {
                            body += chunk.toString();
                        });
                        req.on('end', async () => {
                            try {
                                await fs.writeFile(dataPath, body);
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true }));
                            } catch (err) {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: 'Failed to save data' }));
                            }
                        });
                    } else {
                        next();
                    }
                });

                // Middleware for serving local assets
                server.middlewares.use(async (req, res, next) => {
                    const prefix = '/briac-le-meillat/assets-inspi';

                    let urlPath = req.url.split('?')[0];

                    if (!urlPath.startsWith(prefix)) {
                        return next();
                    }

                    const fs = await import('fs/promises');
                    const relativePath = decodeURIComponent(urlPath).replace(prefix, '');

                    if (relativePath.includes('..')) {
                        res.statusCode = 403;
                        res.end('Forbidden');
                        return;
                    }

                    const filePath = path.resolve(__dirname, '../assets-inspi', relativePath.replace(/^\//, ''));

                    try {
                        const stats = await fs.stat(filePath);
                        if (stats.isFile()) {
                            const fileContent = await fs.readFile(filePath);
                            if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
                            else if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
                            else if (filePath.endsWith('.jpeg') || filePath.endsWith('.jpg')) res.setHeader('Content-Type', 'image/jpeg');
                            else if (filePath.endsWith('.webp')) res.setHeader('Content-Type', 'image/webp');
                            res.end(fileContent);
                            return;
                        }
                    } catch (err) { }
                    next();
                });
            }
        }
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
