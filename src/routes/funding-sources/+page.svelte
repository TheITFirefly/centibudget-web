<script lang="ts">
	import { resolve } from '$app/paths';

	import { budget } from '$lib/shared.svelte';

	import EmptyState from '$lib/components/ui/empty-state/empty-state.svelte';
	import FundingSourceCard from '$lib/components/ui/funding-source-card/funding-source-card.svelte';
	import AddFundingSourceDialog from '$lib/components/ui/add-funding-source-dialog/add-funding-source-dialog.svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	import { BanknoteArrowUp, CirclePlus, CircleX } from 'lucide-svelte';

	let income = $derived(budget.current['Funding Sources']);

	let addDialogOpen = $state(false);
	let actionButtonOpen = $state(false);
</script>

<AddFundingSourceDialog bind:open={addDialogOpen} />

<h1 class="text-4xl text-heading mb-4">Funding Sources</h1>

<p class="text-muted-foreground">
	Add the jobs and other recurring income sources that fund your budget. Note that editing funding sources is not currently supported except for over in the testing area
</p>

<br />

<h2 class="text-3xl text-heading text-center">Income Sources</h2>

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

<div class="fixed bottom-6 right-6 z-50">
	<DropdownMenu.Root bind:open={actionButtonOpen}>
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'lg'
			})}
		>
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
				Add Funding Source
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<br />
