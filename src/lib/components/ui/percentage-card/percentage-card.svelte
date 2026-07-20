<script lang="ts">
	import { budget } from '$lib/shared.svelte';
	import { formatCurrency } from '$lib/formatters';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { EditPercentageDialog } from '$lib/components/ui/edit-percentage-dialog/index.js';
	import { Check, X, Pencil, Trash } from '@lucide/svelte';

	let { percentAllocation, showActions = false } = $props();

	let editOpen = $state(false);
	let confirmDelete = $state(false);

	let editName = $state('');
	let editAmount = $state(0);
	let editAccount = $state('');

	const accounts = $derived(budget.current['Accounts']);

	const accountBalance = $derived(
		accounts.find((a) => a['Name'] === percentAllocation['Account'])?.['Balance'] ?? 0
	);

	function openEditDialog() {
		editName = percentAllocation['Name'];
		editAmount = percentAllocation['Amount'];
		editAccount = percentAllocation['Account'];
		editOpen = true;
	}

	function saveAllocation() {
		budget.current = {
			...budget.current,
			Allocations: budget.current['Allocations'].map((a) =>
				a['Name'] === percentAllocation['Name']
					? {
							...a,
							Amount: Number(editAmount),
							Account: editAccount
						}
					: a
			)
		};

		editOpen = false;
	}

	function deleteAllocation() {
		if (!confirmDelete) {
			confirmDelete = true;
			return;
		}

		budget.current = {
			...budget.current,
			Allocations: budget.current['Allocations'].filter(
				(a) => a['Name'] !== percentAllocation['Name']
			)
		};
		confirmDelete = false;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-center">
			{percentAllocation['Name']}
		</Card.Title>
	</Card.Header>

	<Card.Content class="text-center">
		<p class="text-3xl font-bold">{percentAllocation['Amount']}%</p>
		<p class="text-sm text-muted-foreground">Linked Account</p>
		<p class="font-medium">{percentAllocation['Account']}</p>
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
