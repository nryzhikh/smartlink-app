import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateHtmlTemplate(data) {

    // Read the HTML template
    let htmlContent = await fs.promises.readFile(
        path.join(__dirname, '../templates/templateIndex.html'),
        'utf-8'
    );

    // Replace the placeholders with data
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.split(placeholder).join(data[key]);
        }
    }

    return htmlContent;
}

export default populateHtmlTemplate;