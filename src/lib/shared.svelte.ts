import defaultSchema from "$lib/schemas/default-app-load.json";
import { LocalStorage } from "$lib/storage.svelte";

export const budget = new LocalStorage("Budget", defaultSchema);
