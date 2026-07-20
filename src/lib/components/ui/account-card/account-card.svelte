<script lang="ts">
	import { formatCurrency } from '$lib/formatters';
	import type { Account } from '$lib/schemas/budget';

	let {
		account
	}: {
		account: Account;
	} = $props();

	const balance = $derived(account.Balance ?? 0);
	const formattedBalance = $derived(formatCurrency(balance));
</script>

<div
	class="h-32 w-40 border rounded-lg flex flex-col overflow-hidden transition-all duration-300 bg-card"
>
	<!-- Header -->
	<div class="text-center font-semibold py-2 border-b">
		{account.Name}
	</div>

	<!-- Body -->
	<div class="flex-1 flex items-center justify-center text-lg font-bold">
		{formattedBalance}
	</div>
</div>
