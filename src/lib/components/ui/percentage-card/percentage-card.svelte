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
	import { Check, X, Pencil, Trash } from 'lucide-svelte';

	let { percentAllocation, showActions = false } = $props();

	let editOpen = $state(false);
	let confirmDelete = $state(false);

	let editAmount = $state(0);
	let editAccount = $state('');

	const accounts = $derived(budget.current['Accounts']);

	const accountBalance = $derived(
		accounts.find((a) => a['Name'] === percentAllocation['Account'])?.['Balance'] ?? 0
	);

	function openEditDialog() {
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
	}
</script>

<Card.Root class="flex flex-col items-center py-4 gap-2">
	<Card.Header class="pb-0">
		<Card.Title class="text-center">{percentAllocation['Name']}</Card.Title>
	</Card.Header>

	<Card.Content class="flex flex-col items-center gap-2 pb-0">
		<div class="text-center">
			<div class="text-3xl font-bold">
				{percentAllocation['Amount']}%
			</div>
		</div>

		<div class="text-center">
			<p class="text-sm text-muted-foreground">Linked Account</p>
			<p class="font-medium">
				{percentAllocation['Account']}
			</p>
		</div>
	</Card.Content>

	<Card.Footer class="gap-2 pt-2">
		{#if showActions}
			{#if confirmDelete}
				<Button variant="ghost" onclick={() => (confirmDelete = false)}>
					<X />
				</Button>
			{:else}
				<Dialog.Root bind:open={editOpen}>
					<Dialog.Trigger class={buttonVariants({ variant: 'ghost' })} onclick={openEditDialog}>
						<Pencil />
					</Dialog.Trigger>

					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Edit Percentage Allocation</Dialog.Title>
						</Dialog.Header>

						<div class="grid gap-4 py-4">
							<div class="grid gap-2">
								<Label>Name</Label>
								<Input readonly value={percentAllocation['Name']} />
							</div>

							<div class="grid gap-2">
								<Label>Percentage</Label>
								<Input type="number" min="0" max="100" bind:value={editAmount} />
							</div>

							<div class="grid gap-2">
								<Label>Account</Label>
								<Select.Root type="single" bind:value={editAccount}>
									<Select.Trigger class="w-full">
										{editAccount || 'Select an account'}
									</Select.Trigger>

									<Select.Content>
										{#each accounts as account}
											<Select.Item value={account['Name']}>
												{account['Name']}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>
						</div>

						<Dialog.Footer>
							<Dialog.Close>
								<Button variant="outline">Cancel</Button>
							</Dialog.Close>

							<Button onclick={saveAllocation}>Save</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
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
