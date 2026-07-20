<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import EmptyState from '$lib/components/ui/empty-state/empty-state.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import SavingsGoalCard from '$lib/components/ui/savings-goal-card/savings-goal-card.svelte';
	import SubscriptionCard from '$lib/components/ui/subscription-card/subscription-card.svelte';
	import PercentageCard from '$lib/components/ui/percentage-card/percentage-card.svelte';
	import { budget } from '$lib/shared.svelte';
	import { CalendarSync, Target, CirclePercent, CirclePlus, CircleX } from '@lucide/svelte';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import AddAllocationDialog from '$lib/components/ui/add-allocation-dialog/add-allocation-dialog.svelte';
	import type { Allocation, AllocationPeriod, AllocationType } from '$lib/schemas/budget';

	let allocations = $derived(budget.current.Allocations);
	let savingsGoals = $derived(allocations.filter((allocation) => allocation.Type === 'Fixed'));
	let subscriptions = $derived(
		allocations.filter((allocation) => allocation.Type === 'Subscription')
	);
	let percentAllocations = $derived(
		allocations.filter((allocation) => allocation.Type === 'Percentage')
	);
	let accounts = $derived(budget.current.Accounts);

	let actionButtonOpen = $state(false);
	let addDialogOpen = $state(false);
	let calendarValue = $state<CalendarDate | undefined>();

	let name = $state('');
	let type = $state<AllocationType>('Fixed');
	let period = $state<AllocationPeriod>('One-time');
	let amount = $state(0);
	let account = $state('');
	let lastPaid = $state<string | null>(null);

	function openAddDialog(selectedType: AllocationType) {
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

		if (allocations.some((allocation) => allocation.Name === name.trim())) {
			alert('An allocation with that name already exists');
			return;
		}

		const allocation: Allocation = {
			Name: name.trim(),
			Type: type,
			Period: period,
			'Last Paid': type === 'Subscription' ? lastPaid : null,
			Amount: amount,
			Account: account
		};

		budget.current = {
			...budget.current,
			Allocations: [...allocations, allocation]
		};
		calendarValue = undefined;
		addDialogOpen = false;
	}

	const dialogTitle: Record<AllocationType, string> = {
		Fixed: 'Add Savings Goal',
		Subscription: 'Add Subscription',
		Percentage: 'Add Percent-Based Allocation'
	};
</script>

<svelte:head>
	<title>Allocations - CentiBudget</title>
</svelte:head>

<AddAllocationDialog bind:open={addDialogOpen} bind:type />
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
		<div class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,128px)]">
			{#each savingsGoals as savingsGoal}
				<SavingsGoalCard savingsGoalAllocation={savingsGoal} showActions={true} />
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
		<div class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,320px)]">
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
	<br />
	<div class="max-w-7xl mx-auto">
		<div class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,128px)]">
			{#each percentAllocations as percentAllocation}
				<PercentageCard {percentAllocation} showActions={true} />
			{/each}
		</div>
	</div>
	<br />
{/if}
<br />

<!-- ActionButton -->
<div class="fixed bottom-6 right-6 z-50">
	<DropdownMenu.Root bind:open={actionButtonOpen}>
		<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'lg' })}>
			{#if actionButtonOpen}
				<CircleX class="size-10" />
			{:else}
				<CirclePlus class="size-10" />
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
