import { downloadFileFromS3 } from '../utils/s3ClientV3.js';

async function downloadFile(fastify, options) {
fastify.get('/download', async (request, reply) => {
    const key = request.query.Key;
  
    try {
      const fileData = await downloadFileFromS3(key);
      const fileName = decodeURIComponent(key); // adjust this line if your key structure is different
  
      reply
        .header('Content-Disposition', `attachment; filename="${fileName}"`)
        .header('Content-Type', 'application/octet-stream')
        .send(fileData);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}

export default downloadFile;