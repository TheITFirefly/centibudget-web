<script lang="ts">
	import { formatCurrency, formatDate, formatDays } from '$lib/formatters';
	import { Pencil, Trash, Check, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { budget } from '$lib/shared.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { CalendarDate } from '@internationalized/date';
	import type { Allocation } from '$lib/schemas/budget';
	import { EditSubscriptionDialog } from '$lib/components/ui/edit-subscription-dialog/index.js';

	let {
		subscriptionAllocation,
		showActions = false
	}: {
		subscriptionAllocation: Allocation;
		showActions?: boolean;
	} = $props();

	let confirmDelete = $state(false);
	let editOpen = $state(false);

	//remove special characters, lowercase (slugify)
	const subscriptionNameId = $derived(
		`subscription-title-${subscriptionAllocation.Name.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')}`
	);

	function calculateNextPayDate(lastPaidDate: string, period: string): Date {
		const date = new Date(`${lastPaidDate}T00:00:00`);
		const next = new Date(date);

		if (period === 'Weekly') next.setDate(date.getDate() + 7);
		else if (period === 'Biweekly') next.setDate(date.getDate() + 14);
		else if (period === 'Monthly') next.setMonth(date.getMonth() + 1);
		else if (period === 'Yearly') next.setFullYear(date.getFullYear() + 1);

		return next;
	}

	function daysUntil(date: Date): number {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return Math.max(0, Math.floor((date.getTime() - now.getTime()) / 86_400_000));
	}

	function deleteSubscription() {
		if (!confirmDelete) {
			confirmDelete = true;
			return;
		}
		confirmDelete = false;
		budget.current = {
			...budget.current,
			Allocations: budget.current.Allocations.filter(
				(allocation) => allocation.Name !== subscriptionAllocation.Name
			)
		};
	}

	const nextPayDate = $derived(
		subscriptionAllocation['Last Paid']
			? calculateNextPayDate(subscriptionAllocation['Last Paid'], subscriptionAllocation['Period'])
			: null
	);
	const daysLeft = $derived(nextPayDate ? daysUntil(nextPayDate) : 0);
	const formattedDate = $derived(formatDate(nextPayDate));
	const formattedAmount = $derived(formatCurrency(subscriptionAllocation.Amount));
	const formattedDays = $derived(formatDays(daysLeft));
</script>

<article
	class="w-80 h-24 border rounded-lg flex overflow-hidden transition-all duration-300 hover:shadow-sm bg-card mx-1"
	aria-labelledby={subscriptionNameId}
>
	<dl class="contents">
		<div class="flex-1 flex items-center justify-center px-3 text-sm font-semibold">
			<dt class="sr-only">Subscription name</dt>
			<dd id={subscriptionNameId}>{subscriptionAllocation.Name}</dd>
		</div>

		<Separator orientation="vertical" class="mx-1" />

		<div class="w-24 flex items-center justify-center text-sm font-medium">
			<dt class="sr-only">Subscription amount</dt>
			<dd>{formattedAmount}</dd>
		</div>

		<Separator orientation="vertical" class="mx-1" />

		<div class="w-33 flex flex-col items-center justify-center text-xs">
			<div>
				<dt class="sr-only">Next payment date</dt>
				<dd>{formattedDate}</dd>
			</div>

			<Separator class="my-1" />

			<div class="text-muted-foreground">
				<dt class="sr-only">Time until next payment</dt>
				<dd>{formattedDays}</dd>
			</div>
		</div>
	</dl>
	{#if showActions}
		<Separator orientation="vertical" class="mx-1" />

		<div class="w-28 flex flex-col items-center justify-center text-xs mx-1">
			<div>
				{#if confirmDelete}
					<Button
						variant="ghost"
						aria-label="Cancel subscription deletion"
						onclick={() => (confirmDelete = false)}
					>
						<X aria-hidden="true" />
					</Button>
				{:else}
					<Button variant="ghost" onclick={() => (editOpen = true)}>
						<Pencil />
					</Button>
					<EditSubscriptionDialog bind:open={editOpen} {subscriptionAllocation} />
				{/if}
			</div>
			<Separator class="my-1" />
			<div>
				<Button
					variant="ghost"
					aria-label={confirmDelete ? 'Confirm subscription deletion' : 'Delete subscription'}
					onclick={deleteSubscription}
				>
					{#if confirmDelete}
						<Check aria-hidden="true" />
						<span class="sr-only" aria-live="polite">
							Deletion confirmation active. Press confirm deletion to remove this subscription, or
							cancel deletion.
						</span>
					{:else}
						<Trash aria-hidden="true" />
					{/if}
				</Button>
			</div>
		</div>
	{/if}
</article>
