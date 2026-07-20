<script lang="ts">
	import { formatDate, formatDays } from '$lib/formatters';
	import type { AllocationPeriod, FundingSource } from '$lib/schemas/budget';

	let {
		fundingSource
	}: {
		fundingSource: FundingSource;
	} = $props();

	function calculateNextPayDate(lastPaidDate: string, period: AllocationPeriod): Date {
		const lastPaid = new Date(lastPaidDate);
		const nextPayDate = new Date(lastPaid);

		switch (period) {
			case 'Weekly':
				nextPayDate.setDate(lastPaid.getDate() + 7);
				break;

			case 'Biweekly':
				nextPayDate.setDate(lastPaid.getDate() + 14);
				break;

			case 'Monthly':
				nextPayDate.setMonth(lastPaid.getMonth() + 1);
				break;

			case 'Yearly':
				nextPayDate.setFullYear(lastPaid.getFullYear() + 1);
				break;
		}

		return nextPayDate;
	}

	function daysUntilNextPayDate(nextPayDate: Date) {
		const today = new Date();
		const timeDifference = nextPayDate.getTime() - today.getTime();
		return Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
	}

	const nextPayDate = $derived.by(() => {
		const timing = fundingSource['Pay Timing'];
		if (!timing?.['First Pay Date']) return null;

		return calculateNextPayDate(timing['First Pay Date'], timing.Period);
	});

	const daysLeft = $derived(nextPayDate ? daysUntilNextPayDate(nextPayDate) : 0);
	const formattedDate = $derived(formatDate(nextPayDate));
	const formattedDays = $derived(formatDays(daysLeft));
</script>

<div
	class="w-64 h-24 border rounded-lg flex overflow-hidden transition-all duration-300 hover:shadow-sm bg-card"
>
	<!-- Left -->
	<div class="flex-1 flex items-center justify-center px-3 text-sm font-semibold">
		{fundingSource.Name}
	</div>

	<!-- Vertical divider -->
	<div class="w-px bg-border"></div>

	<!-- Right -->
	<div class="w-28 flex flex-col items-center justify-center text-xs">
		<!-- Date -->
		<div>
			{formattedDate}
		</div>

		<!-- Partial divider -->
		<div class="w-3/4 border-t my-1"></div>

		<!-- Days -->
		<div class="text-muted-foreground">
			{formattedDays}
		</div>
	</div>
</div>
