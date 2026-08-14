import { ApiDatabaseDb } from "./db";
import { apiDatabaseRealtime } from "./realtime";
import { ApiDatabaseStorage } from "./storage";
import { ApiDatabaseAuth } from "./auth";

export class ApiDatabaseClient {
  readonly db: ApiDatabaseDb;
  readonly realtime: apiDatabaseRealtime;
  readonly storage: ApiDatabaseStorage;
  readonly auth: ApiDatabaseAuth;

  constructor(
    private projectUrl: string,
    private apiKey: string,
  ) {
    this.db = new ApiDatabaseDb(projectUrl, apiKey);
    this.realtime = new apiDatabaseRealtime(projectUrl, apiKey);
    this.storage = new ApiDatabaseStorage(projectUrl, apiKey);
    this.auth = new ApiDatabaseAuth(projectUrl, apiKey);
  }

  from<T = Record<string, unknown>>(table: string) {
    return this.db.from<T>(table);
  }
}
