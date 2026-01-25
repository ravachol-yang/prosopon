import { Storage, StorageObject } from "@/lib/storage/types";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export class S3Storage implements Storage {
  private client: S3Client;
  private readonly bucket: string;

  constructor(endpoint: string, accessKeyId: string, secretAccessKey: string, bucket: string) {
    this.client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucket = bucket;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  }

  async get(key: string): Promise<Uint8Array | null> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      const byteArray = await response.Body?.transformToByteArray();
      return byteArray ?? null;
    } catch {
      return null;
    }
  }

  async put(key: string, data: Uint8Array | Buffer, contentType?: string): Promise<StorageObject> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Body: data,
        Key: key,
        ContentType: contentType,
      }),
    );
    return { key, size: data.byteLength, contentType };
  }
}
