import { RealtimeEvent, StorageObject } from "@apiDatabase/types";
//#region src/db/query-builder.d.ts
interface QueryResult<T> {
  data: T | null;
  error: string | null;
}
declare class QueryBuilder<T = Record<string, unknown>> {
  private projectUrl;
  private table;
  private apiKey;
  private _method;
  private _body;
  private _filters;
  private _selectColumns;
  private _orderCol;
  private _orderDir;
  private _limitVal;
  private _offsetVal;
  constructor(projectUrl: string, table: string, apiKey: string);
  select(columns?: string): this;
  eq(column: string, value: unknown): this;
  neq(column: string, value: unknown): this;
  gt(column: string, value: unknown): this;
  gte(column: string, value: unknown): this;
  lt(column: string, value: unknown): this;
  lte(column: string, value: unknown): this;
  like(column: string, pattern: string): this;
  ilike(column: string, pattern: string): this;
  is(column: string, value: "null" | "not null"): this;
  order(column: string, direction?: "asc" | "desc"): this;
  limit(n: number): this;
  offset(n: number): this;
  insert(data: Record<string, unknown>): this;
  update(data: Record<string, unknown>): this;
  delete(): this;
  private getRowIdForMutation;
  private buildUrl;
  execute(): Promise<QueryResult<T | T[]>>;
  then<TResult1 = QueryResult<T | T[]>, TResult2 = never>(onfulfilled?: ((value: QueryResult<T | T[]>) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
}
//#endregion
//#region src/db/index.d.ts
declare class ApiDatabaseDb {
  private projectUrl;
  private apiKey;
  constructor(projectUrl: string, apiKey: string);
  from<T = Record<string, unknown>>(table: string): QueryBuilder<T>;
}
//#endregion
//#region src/realtime/index.d.ts
type RealtimeCallback = (event: RealtimeEvent) => void;
declare class apiDatabaseRealtime {
  private projectUrl;
  private apiKey;
  private socket;
  private callbacks;
  constructor(projectUrl: string, apiKey: string);
  private connect;
  subscribe(table: string, callback: RealtimeCallback): () => void;
  unsubscribe(table: string, callback?: RealtimeCallback): void;
  disconnect(): void;
}
//#endregion
//#region src/storage/index.d.ts
interface StorageResult<T> {
  data: T | null;
  error: string | null;
}
declare class StorageBucketRef {
  private projectUrl;
  private apiKey;
  private bucketName;
  constructor(projectUrl: string, apiKey: string, bucketName: string);
  private storageBase;
  list(): Promise<StorageResult<StorageObject[]>>;
  upload(file: File): Promise<StorageResult<StorageObject>>;
  remove(objectId: string): Promise<StorageResult<{
    message: string;
  }>>;
  getSignedUrl(objectId: string): Promise<StorageResult<{
    url: string;
  }>>;
}
declare class ApiDatabaseStorage {
  private projectUrl;
  private apiKey;
  constructor(projectUrl: string, apiKey: string);
  from(bucketName: string): StorageBucketRef;
}
//#endregion
//#region src/auth/index.d.ts
interface AuthUser {
  id: string;
  email: string;
}
interface AuthResult {
  data: {
    user: AuthUser;
    accessToken: string;
  } | null;
  error: string | null;
}
declare class ApiDatabaseAuth {
  private projectUrl;
  private currentToken;
  constructor(projectUrl: string);
  signUp(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResult>;
  signIn(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResult>;
  sendMagicLink(email: string): Promise<{
    error: string | null;
  }>;
  signInWithGoogle(): void;
  signInWithGithub(): void;
  signOut(): void;
  getUser(): AuthUser | null;
  getAccessToken(): string | null;
}
//#endregion
//#region src/client.d.ts
declare class ApiDatabaseClient {
  private projectUrl;
  private apiKey;
  readonly db: ApiDatabaseDb;
  readonly realtime: apiDatabaseRealtime;
  readonly storage: ApiDatabaseStorage;
  readonly auth: ApiDatabaseAuth;
  constructor(projectUrl: string, apiKey: string);
  from<T = Record<string, unknown>>(table: string): QueryBuilder<T>;
}
//#endregion
//#region src/index.d.ts
declare function createClient(projectUrl: string, apiKey: string): ApiDatabaseClient;
//#endregion
export { ApiDatabaseAuth, ApiDatabaseClient, ApiDatabaseDb, ApiDatabaseStorage, QueryBuilder, type QueryResult, type RealtimeCallback, apiDatabaseRealtime, createClient };
//# sourceMappingURL=index.d.ts.map