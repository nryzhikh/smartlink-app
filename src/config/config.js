import fastifyEnv from '@fastify/env';

const envSchema = {
  type: 'object',
  required: ['S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_ENDPOINT', 'S3_BUCKET', 'AWS_REGION'],
  properties: {
    S3_ACCESS_KEY_ID: { type: 'string' },
    S3_SECRET_ACCESS_KEY: { type: 'string' },
    S3_ENDPOINT: { type: 'string' },
    S3_BUCKET: { type: 'string' },
    AWS_REGION: { type: 'string' },
  },
};

export const loadEnv = (fastify) => {
  fastify.register(fastifyEnv, {
    confKey: 'config',
    schema: envSchema,
    dotenv: true
  });
};