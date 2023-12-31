import Fastify from 'fastify';
import { loadEnv } from './config/config.js';
import initServer from './initServer.js';
import { testS3Connection } from './utils/s3ClientV3.js';
import errorHandler from './errorHandler.js';

const fastify = Fastify({ logger: true });

loadEnv(fastify);

initServer(fastify);

errorHandler(fastify);

fastify.ready(async (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // await initializeS3Client(fastify.config);
  await testS3Connection();
});

// fastify.listen({ port: 3000 }, (err, address) => {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
//   console.log(`Server listening on ${address}`);
// });


const port = process.env.PORT || 3000; // 3000 or any other default value

  fastify.listen({port: port, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});