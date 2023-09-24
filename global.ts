import { Queue } from "bullmq";

const {
  REDIS_CONNECTION_USERNAME,
  REDIS_CONNECTION_PASSWORD,
  REDIS_CONNECTION_PORT,
  REDIS_CONNECTION_HOST,
} = process.env;

if (
  !REDIS_CONNECTION_USERNAME ||
  !REDIS_CONNECTION_PASSWORD ||
  !REDIS_CONNECTION_HOST ||
  !REDIS_CONNECTION_PORT
) {
  throw "Redis connection details is not (completly or partially) present in env, please add and run again";
}

const BULLMQ_DOCS_PROCESSING_QUEUE_NAME = "chatdocsgpt-docs-processing-queue";

const bullMQQueue = new Queue(BULLMQ_DOCS_PROCESSING_QUEUE_NAME, {
  connection: {
    password: REDIS_CONNECTION_PASSWORD,
    username: REDIS_CONNECTION_USERNAME,
    tls: {
      host: REDIS_CONNECTION_HOST,
      port: parseInt(REDIS_CONNECTION_PORT),
    },
  },
});

export {
  REDIS_CONNECTION_USERNAME,
  REDIS_CONNECTION_PASSWORD,
  REDIS_CONNECTION_PORT,
  REDIS_CONNECTION_HOST,
  BULLMQ_DOCS_PROCESSING_QUEUE_NAME,
  bullMQQueue,
};
