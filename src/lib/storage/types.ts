export interface StorageObject {
  key: string;
  size: number;
  contentType?: string;
}

export interface Storage {
  put(key: string, data: Uint8Array | Buffer, contentType?: string): Promise<StorageObject>;
  get(key: string): Promise<Uint8Array | null>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
}
