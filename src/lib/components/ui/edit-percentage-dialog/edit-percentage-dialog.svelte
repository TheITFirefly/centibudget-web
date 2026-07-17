<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button/index.js';
	import { budget } from '$lib/shared.svelte';
	import type { Allocation } from '$lib/schemas/budget';

	let {
		open = $bindable(),
		percentAllocation
	}: {
		open: boolean;
		percentAllocation: Allocation;
	} = $props();

	let editName = $derived(percentAllocation.Name);
	let editAmount = $derived(percentAllocation.Amount);
	let editAccount = $derived(percentAllocation.Account);

	const accounts = $derived(budget.current.Accounts);

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
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Percentage Allocation</Dialog.Title>
			<Dialog.Description>Update Percentage Allocation Details</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="allocation-name">Name (Cannot be changed)</Label>
				<Input id="allocation-name" readonly bind:value={editName} />
			</div>

			<div class="grid gap-2">
				<Label for="allocation-percent">Percentage</Label>
				<Input id="allocation-percent" type="number" min="0" max="100" bind:value={editAmount} />
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
