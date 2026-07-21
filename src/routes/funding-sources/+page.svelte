<script lang="ts">
	import { resolve } from '$app/paths';

	import { budget } from '$lib/shared.svelte';

	import EmptyState from '$lib/components/ui/empty-state/empty-state.svelte';
	import FundingSourceCard from '$lib/components/ui/funding-source-card/funding-source-card.svelte';
	import { AddHourlyFundingSourceDialog } from '$lib/components/ui/add-hourly-funding-source-dialog/index.js';
	import { AddSalariedFundingSourceDialog } from '$lib/components/ui/add-salaried-funding-source-dialog/index.js';
	import { AddStudentFundingSourceDialog } from '$lib/components/ui/add-student-funding-source-dialog/index.js';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	import { BanknoteArrowUp, CirclePlus, CircleX } from '@lucide/svelte';

	let income = $derived(budget.current['Funding Sources']);

	let addHourlyDialogOpen = $state(false);
	let addSalariedDialogOpen = $state(false);
	let addStudentDialogOpen = $state(false);
	let actionButtonOpen = $state(false);
</script>

<svelte:head>
	<title>Funding Sources - CentiBudget</title>
</svelte:head>

<AddHourlyFundingSourceDialog bind:open={addHourlyDialogOpen} />
<AddSalariedFundingSourceDialog bind:open={addSalariedDialogOpen} />
<AddStudentFundingSourceDialog bind:open={addStudentDialogOpen} />

<h1 class="text-4xl text-heading mb-4">Funding Sources</h1>

<p class="text-muted-foreground">
	Add the jobs and other recurring income sources that fund your budget. Note that editing funding
	sources is not currently supported except for over in the testing area
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
			{#each income as fundingSource}
				<FundingSourceCard {fundingSource} />
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
					addHourlyDialogOpen = true;
				}}
			>
				Add Hourly Job
			</DropdownMenu.Item>

			<DropdownMenu.Item
				class="py-3 px-4 text-base cursor-pointer"
				onclick={() => {
					actionButtonOpen = false;
					addSalariedDialogOpen = true;
				}}
			>
				Add Salaried Job
			</DropdownMenu.Item>

			<DropdownMenu.Item
				class="py-3 px-4 text-base cursor-pointer"
				onclick={() => {
					actionButtonOpen = false;
					addStudentDialogOpen = true;
				}}
			>
				Add Student Job
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<br />
