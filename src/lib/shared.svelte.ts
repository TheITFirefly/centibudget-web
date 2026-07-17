import defaultSchema from "$lib/schemas/default-app-load.json";
import { LocalStorage } from "$lib/storage.svelte";
import type { Budget } from "$lib/schemas/budget";

export const budget = new LocalStorage<Budget>("Budget", defaultSchema as Budget);
