export function formatCurrency(value: number | null | undefined): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(value ?? 0);
}

export function formatDate(date: Date | string | null | undefined): string {
	if (!date) return "—";

	const d = typeof date === "string" ? new Date(date) : date;

	return d.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}

export function formatDays(value: number | null | undefined): string {
	if (value == null) return "—";
	return `${value} day${value === 1 ? "" : "s"}`;
}