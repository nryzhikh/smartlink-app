import { s3UploadFile } from '../utils/s3ClientV3.js'; // Assuming this is the separated S3 module
import populateHtmlTemplate from '../utils/populateHtmlTemplate.js'; // Separate module for HTML population
import createZipFile from '../utils/createZipFile.js'; // Separate module for ZIP file creation
import { v4 as uuidv4 } from 'uuid';

async function formProcessor(fastify, options) {
    fastify.post('/process-form', async (request, reply) => {
        try {
            const formFields = request.body;
            const populatedHtml = await populateHtmlTemplate(formFields);

            const zipContent = await createZipFile(populatedHtml);
            const shortId = uuidv4().split('-')[0]; // This will give you the first part of the UUID, which is 8 characters long
            const date = new Date().toISOString().split('T')[0]; // This will give you the current date in the format YYYY-MM-DD
            const fileName = `files/${date}-${shortId}.zip`;
            const metadata = {
                sl_name: formFields.sl_name,
                android_dp: formFields.android_dp,
                ios_dp: formFields.ios_dp,
                web_link_desk: formFields.web_link_desk,
                need_web: formFields.need_web.toString(),

            };

            await s3UploadFile(zipContent, fileName, metadata);

            return reply.redirect(`/`);
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}


export default formProcessor;