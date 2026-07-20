<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button/index.js';
	import { budget } from '$lib/shared.svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import type { Allocation } from '$lib/schemas/budget';
	import { CalendarIcon } from '@lucide/svelte';
	import { getLocalTimeZone, today, type CalendarDate } from '@internationalized/date';

	let {
		open = $bindable(),
		subscriptionAllocation
	}: {
		open: boolean;
		subscriptionAllocation: Allocation;
	} = $props();

	let editName = $derived(subscriptionAllocation.Name);
	let editAmount = $derived(subscriptionAllocation.Amount);
	let editPeriod = $derived(subscriptionAllocation.Period);
	let editLastPaid = $derived(subscriptionAllocation['Last Paid']);
	let calendarOpen = $state(false);
	let calendarValue = $state<CalendarDate | undefined>();

	function saveSubscription() {
		budget.current = {
			...budget.current,
			Allocations: budget.current.Allocations.map((allocation) =>
				allocation.Name === subscriptionAllocation.Name
					? {
							...allocation,
							Name: editName,
							Amount: Number(editAmount),
							Period: editPeriod,
							'Last Paid': editLastPaid || null
						}
					: allocation
			)
		};
		open = false;
	}
</script>

<Dialog.Root bind:open>
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
							<Button {...props} variant="outline" class="w-full justify-between font-normal">
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
