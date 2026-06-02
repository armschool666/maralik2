import { head, list, put } from "@vercel/blob";
import type { JsonStore } from "./json-store";

export function createBlobJsonStore<T>(blobKey: string, fallback: T): JsonStore<T> {
  // Module-level cache: avoids list() round-trip within the same instance
  let cachedUrl: string | null = null;

  async function getBlobUrl(): Promise<string | null> {
    if (cachedUrl) {
      try {
        await head(cachedUrl);
        return cachedUrl;
      } catch {
        cachedUrl = null;
      }
    }
    const { blobs } = await list({ prefix: blobKey, limit: 1 });
    if (blobs.length > 0) {
      cachedUrl = blobs[0].url;
      return cachedUrl;
    }
    return null;
  }

  async function read(): Promise<T> {
    try {
      const url = await getBlobUrl();
      if (!url) return fallback;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return fallback;
      return (await res.json()) as T;
    } catch {
      return fallback;
    }
  }

  async function write(value: T): Promise<void> {
    const blob = await put(blobKey, JSON.stringify(value, null, 2), {
      access: "public",
      addRandomSuffix: false,
    });
    cachedUrl = blob.url;
  }

  async function update(mutator: (current: T) => T | Promise<T>): Promise<T> {
    const current = await read();
    const next = await mutator(current);
    await write(next);
    return next;
  }

  return { read, write, update };
}
