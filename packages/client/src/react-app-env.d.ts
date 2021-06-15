/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly REACT_APP_SERVER_HOST: string;
  }
}
