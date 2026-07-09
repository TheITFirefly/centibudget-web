<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { budget } from '$lib/shared.svelte';

	let {
		open = $bindable()
	}: {
		open: boolean;
	} = $props();

	let accounts = $derived(budget.current['Accounts']);

	let name = $state('');
	let balance = $state(0);

	// Reset when opened
	$effect(() => {
		if (open) {
			name = '';
			balance = 0;
		}
	});

	function addAccount() {
		if (!name.trim()) {
			alert('Account name is required');
			return;
		}

		if (accounts.some((acc) => acc['Name'] === name.trim())) {
			alert('An account with this name already exists');
			return;
		}

		budget.current = {
			...budget.current,
			Accounts: [
				...accounts,
				{
					Name: name.trim(),
					Balance: Number(balance),
					Transactions: []
				}
			]
		};

		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Account</Dialog.Title>
			<Dialog.Description>Create a new account to track your balance.</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="account-name-input">Account Name</Label>
				<Input id="account-name-input" placeholder="Checking" bind:value={name} />
			</div>

			<div class="grid gap-2">
				<Label for="account-balance-input">Starting Balance</Label>
				<Input id="account-balance-input" type="number" bind:value={balance} />
			</div>
		</div>

		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="outline">Cancel</Button>
			</Dialog.Close>

			<Button onclick={addAccount}>Add Account</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
