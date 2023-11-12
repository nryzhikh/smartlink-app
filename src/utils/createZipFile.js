import JSZip from 'jszip';

async function createZipFile(htmlContent) {
    const zip = new JSZip();
    zip.file('index.html', htmlContent);
    return zip.generateAsync({ type: 'nodebuffer' });
}

export default createZipFile;