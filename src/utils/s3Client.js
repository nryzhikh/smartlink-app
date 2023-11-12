import AWS from 'aws-sdk';

let s3;

const initializeS3Client = (config) => {
  AWS.config.update({
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    endpoint: config.S3_ENDPOINT,
    s3ForcePathStyle: true,
  });

  s3 = new AWS.S3();

  return s3;
};

const testS3Connection = async () => {
  try {
    const data = await s3.listBuckets().promise();
    console.log('Successfully connected to S3. Available buckets:', data.Buckets);
    return true;
  } catch (err) {
    console.error('Failed to connect to S3:', err);
    return false;
  }
};

const s3UploadFile = async (fileContent) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: 'your_download.zip',
    Body: fileContent,
  };

  try {
    const response = await s3.upload(params).promise();
    console.log('File uploaded successfully. File location:', response.Location);
    return response;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

const getFilesFromS3 = async () => {
  const params = {
    Bucket: process.env.S3_BUCKET,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents.map(file => {
      return {
        key: file.Key,
        lastModified: file.LastModified,
        size: file.Size,
        etag: file.ETag,
        url: `${s3.config.endpoint.href}${params.Bucket}/${encodeURIComponent(file.Key)}`,
      };
    });

    return files;
  } catch (error) {
    console.error('Failed to retrieve files from S3:', error);
    throw error;
  }
};

const downloadFileFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body;
  } catch (error) {
    console.error('Failed to download file from S3:', error);
    throw error;
  }
};



export { initializeS3Client, testS3Connection, s3UploadFile, getFilesFromS3, downloadFileFromS3 };