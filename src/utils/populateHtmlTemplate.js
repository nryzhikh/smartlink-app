import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateHtmlTemplate(data) {

    console.log(data);

    // Read the HTML template
    let htmlContent = await fs.promises.readFile(
        path.join(__dirname, '../templates/templateIndex.html'),
        'utf-8'
    );

    const arrayKeys = ['android_app', 'ios_apps_dp', 'params_URL', 'params_WEB', 'params_APP']

    // Replace the placeholders with data
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            let value;
            if (arrayKeys.includes(key)) {
                // Split the value by comma and wrap each piece in single quotes
                value = data[key].split(',').map(item => `'${item.trim()}'`).join(', ');
            } else {
                value = typeof data[key] === 'boolean' ? data[key] : `'${data[key]}'`;
            }
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(placeholder, value);
        }
    }

    return htmlContent;
}

export default populateHtmlTemplate;