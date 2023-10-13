import { Queue } from "bullmq";
import { ChatCompletionRequestMessage } from "openai-edge";

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

export { bullMQQueue };

// Sync with supabase table definitions?
export type TQueryDumpTableDefinitions = {
  // generated
  id: string;
  created_at: number;

  // passed
  query_data: {
    type: string;
    data: TQueryDumpData;
  };
};

export type TQueryDumpData = {
  /**
   * @deprecated legacy logging
   */
  maxCompletionTokens: number;

  /**
   * @deprecated legacy logging
   */
  temperature: number;

  /**
   * @deprecated legacy logging
   */
  stream: boolean;

  /**
   * @deprecated legacy logging
   */
  botId: string;

  /**
   * @deprecated legacy logging
   */
  model: string;

  config: {
    maxCompletionTokens: number;
    temperature: number;
    stream: boolean;
    botId: string;
    model: string;
  };

  input: ChatCompletionRequestMessage[];
  output: string;

  context: string;

  query: string;
  answer: string;

  inputTokenCount: number;
  outputTokenCount: number;
  totalTokenCount: number;

  inputCostInUSD: number;
  outputCostInUSD: number;
  totalCostInUSD: number;

  userId: string;
  userAvatarURL: string;
  userFullName: string;
  userEmail: string;

  // Types for processed data
  id?: string;
  type?: string;
  formattedDateString?: string;
};
