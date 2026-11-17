// API entry point: starts the HTTP server on PORT (default 3000).
import { start } from './http/server';

start()
  .then((server) => {
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : process.env.PORT ?? 3000;
    console.log(`api listening on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error('api failed to start', err);
    process.exit(1);
  });
