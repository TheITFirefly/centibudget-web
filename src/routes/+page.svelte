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

<h1 class="text-4xl text-heading text-center">Dashboard</h1>

<h2 class="text-3xl text-heading text-center">Income</h2>
{#if income.length === 0}
	<EmptyState
		icon={BanknoteArrowUp}
		title="No Income Sources"
		description="Add an income source"
		href={resolve('/funding-sources')}
	/>
{:else}
	<br />
	<div class="max-w-7xl mx-auto px-4">
		<div class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,256px)]">
			{#each income as source}
				<FundingSourceCard {source} />
			{/each}
		</div>
	</div>
	<br />
{/if}

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
				<SavingsGoalCard goal={savingsGoal} />
			{/each}
		</div>
	</div>
	<br />
{/if}

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
				<SubscriptionCard {subscription} />
			{/each}
		</div>
	</div>
	<br />
{/if}

<h2 class="text-3xl text-heading text-center">Accounts</h2>
{#if accounts.length === 0}
	<EmptyState
		icon={PiggyBank}
		title="No Accounts"
		description="Add an account"
		href={resolve('/accounts')}
	/>
{:else}
	<br />
	<div class="max-w-7xl mx-auto px-4">
		<div class="grid gap-6 justify-center grid-cols-[repeat(auto-fit,160px)]">
			{#each accounts as account}
				<AccountCard {account} />
			{/each}
		</div>
	</div>
	<br />
{/if}
