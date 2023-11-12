import formBody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import formProcessorRoute from './routes/formProcessor.js';
import view from '@fastify/view';
import getData from './routes/getData.js';
import ejs from 'ejs';
import downloadFile from './routes/downloadFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initServer = (fastify) => {
  fastify.register(formBody);
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
  });
  fastify.register(formProcessorRoute);
  fastify.register(getData);
  fastify.register(downloadFile);

  fastify.register(view, {
    engine: {
      ejs,
    },
  });
};

export default initServer;