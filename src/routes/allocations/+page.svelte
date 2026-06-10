<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import EmptyState from '$lib/components/ui/empty-state/empty-state.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import SavingsGoalBucket from '$lib/components/ui/savings-goal-bucket/savings-goal-bucket.svelte';
	import SubscriptionCard from '$lib/components/ui/subscription-card/subscription-card.svelte';
	import { budget } from '$lib/shared.svelte';
	import { CalendarSync, Target, CirclePercent, CirclePlus, CircleX } from 'lucide-svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarIcon } from 'lucide-svelte';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	let allocations = $derived(budget.current['Allocations']);
	let savingsGoals = $derived(allocations.filter((allocation) => allocation['Type'] === 'Fixed'));
	let subscriptions = $derived(
		allocations.filter((allocation) => allocation['Type'] === 'Subscription')
	);
	let percentAllocations = $derived(
		allocations.filter((allocation) => allocation['Type'] === 'Percentage')
	);
	let accounts = $derived(budget.current['Accounts']);

	let actionButtonOpen = $state(false);
	let addDialogOpen = $state(false);
	let calendarOpen = $state(false);
	let calendarValue = $state<CalendarDate | undefined>();

	let name = $state('');
	let type = $state<'Fixed' | 'Percentage' | 'Subscription'>('Fixed');
	let period = $state('One-time');
	let amount = $state(0);
	let account = $state('');
	let lastPaid = $state<string | null>(null);

	function openAddDialog(selectedType: 'Fixed' | 'Percentage' | 'Subscription') {
		type = selectedType;
		name = '';
		amount = 0;
		account = '';
		lastPaid = null;
		calendarValue = undefined; // add this
		period =
			selectedType === 'Subscription'
				? 'Monthly'
				: selectedType === 'Percentage'
					? 'Constant'
					: 'One-time';
		actionButtonOpen = false;
		addDialogOpen = true;
	}

	// Reactively enforce rules based on Type
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

		if (allocations.some((a) => a['Name'] === name.trim())) {
			alert('An allocation with that name already exists');
			return;
		}

		const allocation = {
			Name: name,
			Type: type,
			Period: period,
			'Last Paid': type === 'Subscription' ? lastPaid : null,
			Amount: Number(amount),
			Account: account
		};

		budget.current = {
			...budget.current,
			Allocations: [...allocations, allocation]
		};
		calendarValue = undefined;
		addDialogOpen = false;
	}

	const dialogTitle: Record<string, string> = {
		Fixed: 'Add Savings Goal',
		Subscription: 'Add Subscription',
		Percentage: 'Add Percent-Based Allocation'
	};
</script>
<h2 class="text-3xl text-heading text-center">Savings Goals</h2>
{#if savingsGoals.length === 0}
	<EmptyState
		icon={Target}
		title="No Savings Goals"
		description="Add a savings goal"
		href={resolve('/allocations')}
	/>
{:else}
	<br />
	<div class="max-w-7xl mx-auto px-4">
		<div class="grid gap-6 justify-center [grid-template-columns:repeat(auto-fit,128px)]">
			{#each savingsGoals as savingsGoal}
				<SavingsGoalBucket goal={savingsGoal} showActions={true} />
			{/each}
		</div>
	</div>
	<br />
{/if}

<br />
<h2 class="text-3xl text-heading text-center">Subscriptions</h2>
{#if subscriptions.length === 0}
	<EmptyState
		icon={CalendarSync}
		title="No Subscriptions"
		description="Add a subscription"
		href={resolve('/allocations')}
	/>
{:else}
	<br />
	<div class="max-w-7xl mx-auto px-4">
		<div class="grid gap-6 justify-center [grid-template-columns:repeat(auto-fit,320px)]">
			{#each subscriptions as subscription}
				<SubscriptionCard {subscription} showActions={true} />
			{/each}
		</div>
	</div>
	<br />
{/if}

<br />
<h2 class="text-3xl text-heading text-center">Percent-Based Allocations</h2>
{#if percentAllocations.length === 0}
	<EmptyState
		icon={CirclePercent}
		title="No Percentage-based Allocations"
		description="Add a percentage-based allocation"
		href={resolve('/allocations')}
	/>
{:else}
	<div class="max-w-6xl mx-auto px-4 mt-6">
		<div class="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
			<!-- Header -->
			<div
				class="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-muted/30"
			>
				<div>
					<h3 class="text-lg font-semibold text-card-foreground">Percentage Allocations</h3>
					<p class="text-sm text-muted-foreground">Recurring income distribution rules</p>
				</div>

				<div class="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
					{percentAllocations.length}
					{percentAllocations.length === 1 ? 'allocation' : 'allocations'}
				</div>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr class="border-b border-border/60 bg-muted/20">
							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
							>
								Name
							</th>

							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
							>
								Allocation
							</th>

							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
							>
								Account
							</th>

							<th
								class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
							>
								Period
							</th>
						</tr>
					</thead>

					<tbody>
						{#each percentAllocations as allocation, index}
							<tr
								class="
                border-b border-border/40
                transition-all duration-150
                hover:bg-muted/30
                last:border-0
              "
							>
								<!-- Name -->
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div
											class="
                      flex h-10 w-10 items-center justify-center
                      rounded-full bg-primary/10
                      text-sm font-semibold text-primary
                    "
										>
											{allocation['Name'].charAt(0)}
										</div>

										<div>
											<div class="font-medium text-foreground">
												{allocation['Name']}
											</div>

											<div class="text-sm text-muted-foreground">Percentage Allocation</div>
										</div>
									</div>
								</td>

								<!-- Allocation -->
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="w-28">
											<div class="h-2 overflow-hidden rounded-full bg-muted">
												<div
													class="h-full rounded-full bg-primary transition-all"
													style={`width: ${Math.min(allocation['Amount'], 100)}%`}
												></div>
											</div>
										</div>

										<span class="font-semibold text-foreground">
											{allocation['Amount'].toFixed(2)}%
										</span>
									</div>
								</td>

								<!-- Account -->
								<td class="px-6 py-4">
									<div
										class="
                    inline-flex items-center rounded-full
                    border border-border/60
                    bg-background px-3 py-1
                    text-sm font-medium
                  "
									>
										{allocation['Account']}
									</div>
								</td>

								<!-- Period -->
								<td class="px-6 py-4">
									<span
										class="
                    inline-flex items-center rounded-full
                    bg-muted px-3 py-1
                    text-sm text-muted-foreground
                  "
									>
										{allocation['Period']}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Footer -->
			<div
				class="
        flex items-center justify-between
        border-t border-border/60
        bg-muted/20
        px-6 py-4
      "
			>
				<div class="text-sm text-muted-foreground">Total Percentage Allocation</div>

				<div class="text-lg font-semibold text-foreground">
					{percentAllocations
						.reduce((sum, allocation) => sum + allocation['Amount'], 0)
						.toFixed(2)}%
				</div>
			</div>
		</div>
	</div>
	<br />
{/if}
<br />

<!-- Add Allocation Dialog -->
<Dialog.Root bind:open={addDialogOpen}>
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
						{#each accounts as acc}
							<Select.Item value={acc['Name']}>{acc['Name']}</Select.Item>
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

<!-- FAB -->
<div class="fixed bottom-6 right-6 z-50">
	<DropdownMenu.Root bind:open={actionButtonOpen}>
		<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'lg' })}>
			{#if actionButtonOpen}
				<CircleX class="size-10"/>
			{:else}
				<CirclePlus class="size-10"/>
			{/if}
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="min-w-56">
			<DropdownMenu.Item
				class="py-3 px-4 text-base cursor-pointer"
				onclick={() => openAddDialog('Fixed')}>Add Savings Goal</DropdownMenu.Item
			>
			<DropdownMenu.Item
				class="py-3 px-4 text-base cursor-pointer"
				onclick={() => openAddDialog('Subscription')}>Add Subscription</DropdownMenu.Item
			>
			<DropdownMenu.Item
				class="py-3 px-4 text-base cursor-pointer"
				onclick={() => openAddDialog('Percentage')}>Add Percent-Based Allocation</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
<br />
