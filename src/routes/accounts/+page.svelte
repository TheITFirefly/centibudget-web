<script lang="ts">
	import { resolve } from '$app/paths';

	import AccountCard from '$lib/components/ui/account-card/account-card.svelte';
	import AddAccountDialog from '$lib/components/ui/add-account-dialog/add-account-dialog.svelte';
	import EmptyState from '$lib/components/ui/empty-state/empty-state.svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	import { budget } from '$lib/shared.svelte';

	import { PiggyBank, CirclePlus, CircleX } from 'lucide-svelte';

	let accounts = $derived(budget.current['Accounts']);

	let addDialogOpen = $state(false);
	let actionButtonOpen = $state(false);
</script>

<svelte:head>
	<title>Accounts - CentiBudget</title>
</svelte:head>

<AddAccountDialog bind:open={addDialogOpen} />

<h2 class="text-3xl text-heading text-center">Existing Accounts</h2>

{#if accounts.length === 0}
	<EmptyState
		icon={PiggyBank}
		title="No Existing Accounts"
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

<!-- Floating Action Button -->
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
				onclick={() => {
					actionButtonOpen = false;
					addDialogOpen = true;
				}}
			>
				Add Account
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<br />
