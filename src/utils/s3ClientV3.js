import { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const testS3Connection = async () => {
  try {
    const data = await client.send(new ListBucketsCommand({}));
    console.log('Successfully connected to S3. Available buckets:', data.Buckets);
    return true;
  } catch (err) {
    console.error('Failed to connect to S3:', err);
    return false;
  }
};

const s3UploadFile = async (fileContent, fileName, metadata) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Body: fileContent,
    Metadata: metadata
  };

  try {
    const response = await client.send(new PutObjectCommand(params));
    console.log('File uploaded successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

const downloadFileFromS3 = async (key) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };
  
    try {
      const { Body } = await client.send(new GetObjectCommand(params));
  
      return new Promise((resolve, reject) => {
        const chunks = [];
        Body.on('data', (chunk) => chunks.push(chunk));
        Body.on('error', reject);
        Body.on('end', () => resolve(Buffer.concat(chunks)));
      });
    } catch (error) {
      console.error('Failed to download file from S3:', error);
      throw error;
    }
  };

const listFilesFromS3 = async () => {
    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        MaxKeys: 50,
  });
    
  try {
    let isTruncated = true;
    let contents = [];

    while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
        contents = [...contents, ...Contents];
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
    }

    // Sort the contents by LastModified date
    contents.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));

    return contents;
} catch (error) {
    console.error('Failed to get files from S3:', error);
    throw error;
}
};

const getMetadataFromS3 = async (contents) => {
  const client = new S3Client({ region: process.env.AWS_REGION });

  for (const content of contents) {
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: content.Key,
    });

    const headData = await client.send(headCommand);
    content.Metadata = headData.Metadata;
  }

  return contents;
};

const getFilesFromS3 = async () => {
  try {
    const contents = await listFilesFromS3();
    const contentsWithMetadata = await getMetadataFromS3(contents);
    return contentsWithMetadata;
  } catch (error) {
    console.error('Failed to get files from S3:', error);
    throw error;
  }
};


export { testS3Connection, s3UploadFile, downloadFileFromS3, getFilesFromS3 };