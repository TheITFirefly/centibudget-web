<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { budget } from '$lib/shared.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Allocation } from '$lib/schemas/budget';

	let {
		open = $bindable(),
		savingsGoalAllocation
	}: {
		open: boolean;
		savingsGoalAllocation: Allocation;
	} = $props();

	let editName = $derived(savingsGoalAllocation.Name);
	let editAmount = $derived(savingsGoalAllocation.Amount);
	let editAccount = $derived(savingsGoalAllocation.Account);

	const accounts = $derived(budget.current.Accounts);

	function saveGoal() {
		budget.current = {
			...budget.current,
			Allocations: budget.current.Allocations.map((savingsGoal) =>
				savingsGoal.Name === savingsGoalAllocation.Name
					? { ...savingsGoal, Name: editName, Amount: Number(editAmount), Account: editAccount }
					: savingsGoal
			)
		};
    console.log(typeof(budget.current.Allocations));
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Goal</Dialog.Title>
			<Dialog.Description>Update your savings goal details.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="goal-name">Name (Cannot be changed)</Label>
				<Input id="goal-name" readonly bind:value={editName} />
			</div>
			<div class="grid gap-2">
				<Label for="goal-amount">Target Amount</Label>
				<Input id="goal-amount" type="number" bind:value={editAmount} />
			</div>
			<div class="grid gap-2">
				<Label for="goal-account">Linked Account</Label>
				<Select.Root type="single" bind:value={editAccount}>
					<Select.Trigger class="w-full">
						{editAccount || 'Select an account'}
					</Select.Trigger>
					<Select.Content>
						{#each accounts as account}
							<Select.Item value={account.Name}>{account.Name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="outline">Cancel</Button>
			</Dialog.Close>
			<Button onclick={saveGoal}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
