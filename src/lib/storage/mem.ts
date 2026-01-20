import { StorageObject, Storage } from "@/lib/storage/types";

export class MemStorage implements Storage {
  private map = new Map<string, Uint8Array>();

  async delete(key: string): Promise<void> {
    this.map.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.map.has(key);
  }

  async get(key: string): Promise<Uint8Array | null> {
    return this.map.get(key) ?? null;
  }

  async put(key: string, data: Uint8Array, contentType?: string): Promise<StorageObject> {
    this.map.set(key, data);
    return { key, size: data.byteLength, contentType };
  }
}
