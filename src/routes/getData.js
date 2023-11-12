import { getFilesFromS3 } from '../utils/s3ClientV3.js';
import getTemplateFields from '../utils/getTemplateFields.js';

async function getData(fastify, options) {
    fastify.get('/', async (request, reply) => {
        try {
            const files = await getFilesFromS3();
            const fields = await getTemplateFields();
            return reply.view('src/views/index.ejs', { files, fields });
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}

export default getData;