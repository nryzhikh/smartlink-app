import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getTemplateFields(data) {
// Read the HTML template
let htmlContent = await fs.promises.readFile(
    path.join(__dirname, '../templates/templateIndex.html'),
    'utf-8'
);

// Find the placeholders in the template
const placeholderRegex = /{{(.*?)}}/g;
const fields = [...new Set(htmlContent.match(placeholderRegex))].map(field => field.replace(/{{|}}/g, ''));

return fields
}

export default getTemplateFields;