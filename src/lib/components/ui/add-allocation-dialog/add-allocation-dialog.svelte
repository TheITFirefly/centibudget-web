<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarIcon } from '@lucide/svelte';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import { budget } from '$lib/shared.svelte';
	import type { AllocationType } from '$lib/schemas/budget';

	let {
		open = $bindable(),
		type = $bindable()
	}: {
		open: boolean;
		type: AllocationType;
	} = $props();

	let accounts = $derived(budget.current.Accounts);

	let name = $state('');
	let period = $state('One-time');
	let amount = $state(0);
	let account = $state('');
	let lastPaid = $state<string | null>(null);
	let calendarOpen = $state(false);
	let calendarValue = $state<CalendarDate | undefined>();

	// Reset form when dialog opens
	$effect(() => {
		if (open) {
			name = '';
			amount = 0;
			account = '';
			lastPaid = null;
			calendarValue = undefined;
			period =
				type === 'Subscription' ? 'Monthly' : type === 'Percentage' ? 'Constant' : 'One-time';
		}
	});

	// Enforce period/lastPaid rules based on type
	$effect(() => {
		switch (type) {
			case 'Fixed':
				if (period !== 'One-time') period = 'One-time';
				if (lastPaid !== null) lastPaid = null;
				break;
			case 'Percentage':
				if (period !== 'Constant') period = 'Constant';
				if (lastPaid !== null) lastPaid = null;
				break;
			case 'Subscription':
				if (!['Weekly', 'Biweekly', 'Monthly', 'Yearly'].includes(period)) {
					period = 'Monthly';
				}
				break;
		}
	});

	function addAllocation() {
		if (!name.trim()) {
			alert('Name is required');
			return;
		}

		if (!account) {
			alert('Account is required');
			return;
		}

		const allocations = budget.current.Allocations;

		if (allocations.some((account) => account.Name === name.trim())) {
			alert('An allocation with that name already exists');
			return;
		}

		budget.current = {
			...budget.current,
			Allocations: [
				...allocations,
				{
					Name: name,
					Type: type,
					Period: period,
					'Last Paid': type === 'Subscription' ? lastPaid : null,
					Amount: Number(amount),
					Account: account
				}
			]
		};

		open = false;
	}

	const dialogTitle: Record<string, string> = {
		Fixed: 'Add Savings Goal',
		Subscription: 'Add Subscription',
		Percentage: 'Add Percent-Based Allocation'
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{dialogTitle[type]}</Dialog.Title>
			<Dialog.Description>Fill in the details for your new allocation.</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="allocation-name-input">Name</Label>
				<Input id="allocation-name-input" bind:value={name} />
			</div>

			{#if type === 'Subscription'}
				<div class="grid gap-2">
					<Label for="subscription-period-selector">Period</Label>
					<Select.Root type="single" bind:value={period}>
						<Select.Trigger class="w-full">{period}</Select.Trigger>
						<Select.Content>
							<Select.Item value="Weekly">Weekly</Select.Item>
							<Select.Item value="Biweekly">Biweekly</Select.Item>
							<Select.Item value="Monthly">Monthly</Select.Item>
							<Select.Item value="Yearly">Yearly</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<Label for="subscription-last-paid-input">Last Paid</Label>
					<Popover.Root bind:open={calendarOpen}>
						<Popover.Trigger id="subscription-last-paid-input">
							{#snippet child({ props })}
								<Button {...props} variant="outline" class="w-full justify-between font-normal">
									{lastPaid ? new Date(`${lastPaid}T00:00:00`).toLocaleDateString() : 'Select date'}
									<CalendarIcon class="size-4" />
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
										lastPaid = `${v.year}-${String(v.month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}`;
									}
									calendarOpen = false;
								}}
								minValue={today(getLocalTimeZone()).subtract({ years: 2 })}
								maxValue={today(getLocalTimeZone())}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
			{/if}

			<div class="grid gap-2">
				<Label for="allocation-amount-input">
					{type === 'Percentage' ? 'Percentage (%)' : 'Amount'}
				</Label>
				<Input id="allocation-amount-input" type="number" bind:value={amount} />
			</div>

			<div class="grid gap-2">
				<Label for="allocation-account-selector">Account</Label>
				<Select.Root type="single" bind:value={account}>
					<Select.Trigger class="w-full">{account || 'Select an account'}</Select.Trigger>
					<Select.Content>
						{#each accounts as account}
							<Select.Item value={account.Name}>{account.Name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="outline">Cancel</Button>
			</Dialog.Close>
			<Button onclick={addAllocation}>Add</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
