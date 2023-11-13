import { getFilesFromS3 } from '../utils/s3ClientV3.js';

async function fetchData(fastify, options) {
    fastify.get('/fetch-data', async (request, reply) => {
        try {
            const files = await getFilesFromS3();
            return files
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}

export default fetchData;