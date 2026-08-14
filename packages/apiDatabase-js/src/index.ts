import { ApiDatabaseClient } from "./client";

export function createClient(
  projectUrl: string,
  apiKey: string,
): ApiDatabaseClient {
  return new ApiDatabaseClient(projectUrl, apiKey);
}

export { ApiDatabaseClient } from "./client";
export { QueryBuilder, ApiDatabaseDb } from "./db";
export type { QueryResult } from "./db";
export { apiDatabaseRealtime } from "./realtime";
export type { RealtimeCallback } from "./realtime";
export { ApiDatabaseStorage } from "./storage";
export { ApiDatabaseAuth } from "./auth";
