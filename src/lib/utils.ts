import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import schema from "$lib/schemas/schema.json";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Using AJV to validate
const ajv = new Ajv({
	allErrors: true,
	strict: false
});
addFormats(ajv);
const validate = ajv.compile(schema);
export type ValidationResult = {
	valid: boolean;
	errors: ErrorObject[] | null | undefined;
};
export function validateBudget(data: unknown): ValidationResult {
	const valid = validate(data);
	return {
		valid: !!valid,
		errors: validate.errors
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
