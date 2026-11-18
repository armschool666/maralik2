import { getContentBucket } from "./cloudflare-r2";
import type { JsonStore } from "./json-store";

// Serialises read-modify-write cycles inside one Worker isolate.
const locks = new Map<string, Promise<unknown>>();

function withLock<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve();
  const next = previous.then(task, task);
  locks.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

/** JSON document stored in the Cloudflare R2 bucket bound as MATERIALS_BUCKET. */
export function createR2JsonStore<T>(objectKey: string, fallback: T): JsonStore<T> {
  const lockKey = `r2:${objectKey}`;

  async function readRaw(): Promise<T> {
    const bucket = getContentBucket();
    if (!bucket) throw new Error("MATERIALS_BUCKET is not configured");
    const object = await bucket.get(objectKey);
    if (!object) return fallback;
    return JSON.parse(await object.text()) as T;
  }

  async function writeRaw(value: T): Promise<void> {
    const bucket = getContentBucket();
    if (!bucket) throw new Error("MATERIALS_BUCKET is not configured");
    await bucket.put(objectKey, JSON.stringify(value, null, 2), {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
    });
  }

  return {
    read: () => withLock(lockKey, readRaw),
    write: (value) => withLock(lockKey, () => writeRaw(value)),
    update: (mutator) =>
      withLock(lockKey, async () => {
        const next = await mutator(await readRaw());
        await writeRaw(next);
        return next;
      }),
  };
}
