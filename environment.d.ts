declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      REDIS_CONNECTION_USERNAME: string;
      REDIS_CONNECTION_PASSWORD: string;
      REDIS_CONNECTION_HOST: string;
      REDIS_CONNECTION_PORT: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
    }
  }
}

export {};
