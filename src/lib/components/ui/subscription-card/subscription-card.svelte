<script lang="ts">
	import { formatCurrency, formatDate, formatDays } from '$lib/formatters';
	import { Pencil, Trash, Check, X, CalendarIcon } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import { budget } from '$lib/shared.svelte';
	import { Label } from '$lib/components/ui/label';
	import Separator from '../separator/separator.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	let { subscription, showActions = false } = $props();

	let confirmDelete = $state(false);
	let editOpen = $state(false);
	let calendarOpen = $state(false);

	let editName = $state('');
	let editAmount = $state(0);
	let editPeriod = $state('Monthly');
	let editLastPaid = $state('');
	let calendarValue = $state<CalendarDate | undefined>();

	//remove special characters, lowercase (slugify)
	const subscriptionNameId = $derived(
		`subscription-title-${subscription['Name']
			.toLowerCase()
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

	function openEditDialog() {
		editName = subscription['Name'];
		editAmount = subscription['Amount'];
		editPeriod = subscription['Period'];
		editLastPaid = subscription['Last Paid'] ?? '';

		if (editLastPaid) {
			const [y, m, d] = editLastPaid.split('-').map(Number);
			calendarValue = new CalendarDate(y, m, d);
		} else {
			calendarValue = undefined;
		}

		editOpen = true;
	}

	function saveSubscription() {
		budget.current = {
			...budget.current,
			Allocations: budget.current['Allocations'].map((a) =>
				a['Name'] === subscription['Name']
					? {
							...a,
							Name: editName,
							Amount: Number(editAmount),
							Period: editPeriod,
							'Last Paid': editLastPaid || null
						}
					: a
			)
		};
		editOpen = false;
	}

	function deleteSubscription() {
		if (!confirmDelete) {
			confirmDelete = true;
			return;
		}
		budget.current = {
			...budget.current,
			Allocations: budget.current['Allocations'].filter((a) => a['Name'] !== subscription['Name'])
		};
	}

	const nextPayDate = $derived(
		subscription['Last Paid']
			? calculateNextPayDate(subscription['Last Paid'], subscription['Period'])
			: null
	);
	const daysLeft = $derived(nextPayDate ? daysUntil(nextPayDate) : 0);
	const formattedDate = $derived(formatDate(nextPayDate));
	const formattedAmount = $derived(formatCurrency(subscription['Amount']));
	const formattedDays = $derived(formatDays(daysLeft));
</script>

<article
	class="w-80 h-24 border rounded-lg flex overflow-hidden transition-all duration-300 hover:shadow-sm bg-card mx-1"
	aria-labelledby={subscriptionNameId}
>
	<dl class="contents">
		<div class="flex-1 flex items-center justify-center px-3 text-sm font-semibold">
			<dt class="sr-only">Subscription name</dt>
			<dd id={subscriptionNameId}>{subscription['Name']}</dd>
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
					<Dialog.Root bind:open={editOpen}>
						<Dialog.Trigger
							class={buttonVariants({ variant: 'ghost' })}
							aria-label="Edit subscription"
							onclick={openEditDialog}
						>
							<Pencil aria-hidden="true" />
						</Dialog.Trigger>
						<Dialog.Content class="sm:max-w-[425px]">
							<Dialog.Header>
								<Dialog.Title>Edit Subscription</Dialog.Title>
								<Dialog.Description>Update subscription details.</Dialog.Description>
							</Dialog.Header>
							<div class="grid gap-4 py-4">
								<div class="grid gap-2">
									<Label for="subscription-name">Name (Cannot be changed)</Label>
									<Input id="subscription-name" readonly bind:value={editName} />
								</div>
								<div class="grid gap-2">
									<Label for="subscription-amount">Amount</Label>
									<Input id="subscription-amount" type="number" bind:value={editAmount} />
								</div>
								<div class="grid gap-2">
									<Label for="subscription-period">Period</Label>
									<Select.Root type="single" bind:value={editPeriod}>
										<Select.Trigger class="w-full">
											{editPeriod || 'Select a period'}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="Weekly">Weekly</Select.Item>
											<Select.Item value="Biweekly">Biweekly</Select.Item>
											<Select.Item value="Monthly">Monthly</Select.Item>
											<Select.Item value="Yearly">Yearly</Select.Item>
										</Select.Content>
									</Select.Root>
								</div>
								<div class="grid gap-2">
									<Label for="subscription-last-paid">Last Paid</Label>
									<Popover.Root bind:open={calendarOpen}>
										<Popover.Trigger id="subscription-last-paid">
											{#snippet child({ props })}
												<Button
													{...props}
													variant="outline"
													class="w-full justify-between font-normal"
												>
													{editLastPaid
														? new Date(`${editLastPaid}T00:00:00`).toLocaleDateString()
														: 'Select date'}
													<CalendarIcon class="size-4" aria-hidden="true" />
												</Button>
											{/snippet}
										</Popover.Trigger>
										<Popover.Content class="w-auto overflow-hidden p-0" align="start">
											<Calendar
												type="single"
												bind:value={calendarValue}
												captionLayout="dropdown"
												onValueChange={(v) => {
													if (v) {
														editLastPaid = `${v.year}-${String(v.month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}`;
													}
													calendarOpen = false;
												}}
												minValue={today(getLocalTimeZone()).subtract({ years: 2 })}
												maxValue={today(getLocalTimeZone())}
											/>
										</Popover.Content>
									</Popover.Root>
								</div>
							</div>
							<Dialog.Footer>
								<Dialog.Close>
									<Button variant="outline">Cancel</Button>
								</Dialog.Close>
								<Button onclick={saveSubscription}>Save</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
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
