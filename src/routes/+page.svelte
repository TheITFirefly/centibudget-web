<script>
	import { resolve } from '$app/paths';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import SavingsGoalCard from '$lib/components/ui/savings-goal-card/savings-goal-card.svelte';
	import AccountCard from '$lib/components/ui/account-card/account-card.svelte';
	import FundingSourceCard from '$lib/components/ui/funding-source-card/funding-source-card.svelte';
	import SubscriptionCard from '$lib/components/ui/subscription-card/subscription-card.svelte';
	import EmptyState from '$lib/components/ui/empty-state/empty-state.svelte';
	import { Target, PiggyBank, CalendarSync, BanknoteArrowUp } from 'lucide-svelte';
	import { budget } from '$lib/shared.svelte';
	import EmptyContent from '$lib/components/ui/empty/empty-content.svelte';

	let income = $derived(budget.current['Funding Sources']);
	let allocations = $derived(budget.current['Allocations']);
	let savingsGoals = $derived(allocations.filter((allocation) => allocation['Type'] === 'Fixed'));
	let subscriptions = $derived(
		allocations.filter((allocation) => allocation['Type'] === 'Subscription')
	);
	let accounts = $derived(budget.current['Accounts']);

	function calculateNextPayDate(lastPaidDate, period) {
		const lastPaid = new Date(lastPaidDate);
		let nextPayDate = new Date(lastPaid);

		if (period === 'Biweekly') {
			nextPayDate.setDate(lastPaid.getDate() + 30);
		}
		// TODO: make this aware of the different periods a subscription can have

		return nextPayDate;
	}

	function daysUntilNextPayDate(nextPayDate) {
		const today = new Date();
		const timeDifference = nextPayDate - today;
		return Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
	}
</script>

<svelte:head>
	<title>Dashboard - CentiBudget</title>
</svelte:head>

<h1 class="text-4xl text-heading text-center">Dashboard</h1>

<div class="space-y-6 my-6">
	<section aria-labelledby="income-heading" class={income.length > 0 ? 'space-y-6' : ''}>
		<h2 id="income-heading" class="text-3xl text-heading text-center">Income</h2>
		{#if income.length === 0}
			<EmptyState
				icon={BanknoteArrowUp}
				title="No Income Sources"
				description="Add an income source"
				href={resolve('/funding-sources')}
			/>
		{:else}
			<ul
				class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,256px)] max-w-7xl mx-auto px-4"
			>
				{#each income as source}
					<li>
						<FundingSourceCard {source} />
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section
		aria-labelledby="savings-goal-heading"
		class={savingsGoals.length > 0 ? 'space-y-6' : ''}
	>
		<h2 id="savings-goal-heading" class="text-3xl text-heading text-center">Savings Goals</h2>
		{#if savingsGoals.length === 0}
			<EmptyState
				icon={Target}
				title="No Savings Goals"
				description="Add a savings goal"
				href={resolve('/allocations')}
			/>
		{:else}
			<ul
				class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,128px)] max-w-7xl mx-auto px-4"
			>
				{#each savingsGoals as savingsGoal}
					<li>
						<SavingsGoalCard goal={savingsGoal} />
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section
		aria-labelledby="subscriptions-heading"
		class={subscriptions.length > 0 ? 'space-y-6' : ''}
	>
		<h2 id="subscriptions-heading" class="text-3xl text-heading text-center">Subscriptions</h2>
		{#if subscriptions.length === 0}
			<EmptyState
				icon={CalendarSync}
				title="No Subscriptions"
				description="Add a subscription"
				href={resolve('/allocations')}
			/>
		{:else}
			<ul
				class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,320px)] max-w-7xl mx-auto px-4"
			>
				{#each subscriptions as subscription}
					<li>
						<SubscriptionCard {subscription} />
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section aria-labelledby="accounts-heading" class={accounts.length > 0 ? 'space-y-6' : ''}>
		<h2 id="accounts-heading" class="text-3xl text-heading text-center">Accounts</h2>
		{#if accounts.length === 0}
			<EmptyState
				icon={PiggyBank}
				title="No Accounts"
				description="Add an account"
				href={resolve('/accounts')}
			/>
		{:else}
			<ul
				class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,160px)] max-w-7xl mx-auto px-4"
			>
				{#each accounts as account}
					<li>
						<AccountCard {account} />
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
