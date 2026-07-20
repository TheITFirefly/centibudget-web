<script lang="ts">
	import { budget } from '$lib/shared.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { EditPercentageDialog } from '$lib/components/ui/edit-percentage-dialog/index.js';
	import { Check, X, Pencil, Trash } from '@lucide/svelte';
	import type { Allocation } from '$lib/schemas/budget';

	let {
		percentAllocation,
		showActions = false
	}: {
		percentAllocation: Allocation;
		showActions: boolean;
	} = $props();

	let editOpen = $state(false);
	let confirmDelete = $state(false);

	function deleteAllocation() {
		if (!confirmDelete) {
			confirmDelete = true;
			return;
		}

		budget.current = {
			...budget.current,
			Allocations: budget.current.Allocations.filter(
				(allocation) => allocation.Name !== percentAllocation.Name
			)
		};
		confirmDelete = false;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-center">
			{percentAllocation.Name}
		</Card.Title>
	</Card.Header>

	<Card.Content class="text-center">
		<p class="text-3xl font-bold">{percentAllocation.Amount}%</p>
		<p class="text-sm text-muted-foreground">Linked Account</p>
		<p class="font-medium">{percentAllocation.Account}</p>
	</Card.Content>

	<Card.Footer>
		{#if showActions}
			{#if confirmDelete}
				<Button variant="ghost" onclick={() => (confirmDelete = false)}>
					<X />
				</Button>
			{:else}
				<Button
					variant="ghost"
					onclick={() => (editOpen = true)}
					aria-label="Edit percentage allocation"
				>
					<Pencil aria-hidden="true" />
				</Button>
				<EditPercentageDialog bind:open={editOpen} {percentAllocation} />
			{/if}

			<Separator orientation="vertical" class="h-6" />

			<Button variant="ghost" onclick={deleteAllocation}>
				{#if confirmDelete}
					<Check />
				{:else}
					<Trash />
				{/if}
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>
