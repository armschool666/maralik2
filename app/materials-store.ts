import type { AdminEntry } from "./material-types";
import { createBlobJsonStore } from "./blob-json-store";
import { getContentBucket } from "./cloudflare-r2";
import { createR2JsonStore } from "./r2-json-store";

// Cloudflare Workers store publications in R2; other deployments keep Vercel Blob.
const blobStore = createBlobJsonStore<AdminEntry[]>("data/materials.json", []);
const r2Store = createR2JsonStore<AdminEntry[]>("data/materials.json", []);
const getStore = () => (getContentBucket() ? r2Store : blobStore);

export const readMaterials = () => getStore().read();
export const writeMaterials = (entries: AdminEntry[]) => getStore().write(entries);
export const updateMaterials = (
  mutator: (entries: AdminEntry[]) => AdminEntry[] | Promise<AdminEntry[]>,
) => getStore().update(mutator);
