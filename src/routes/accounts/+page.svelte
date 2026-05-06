<script lang="ts">
	import { resolve } from '$app/paths';
  import Button from "$lib/components/ui/button/button.svelte";
  import AccountCard from '$lib/components/ui/account-card/account-card.svelte';
  import { budget } from "$lib/shared.svelte";
	import EmptyState from "$lib/components/ui/empty-state/empty-state.svelte";
  import { PiggyBank } from "lucide-svelte";
  
  let accounts = $derived(budget.current['Accounts']);
  let newAccountName = $state("");
  let newAccountBalance = $state(0);

  function addAccount() {
    if (!newAccountName.trim()) {
      alert("Account name is required");
      return;
    }

    const exists = accounts.some(acc => acc["Name"] === newAccountName);
    if (exists) {
      alert("An account with this name already exists");
      return;
    }

    budget.current = {
      ...budget.current,
      Accounts: [...accounts, { Name: newAccountName, Balance: Number(newAccountBalance), Transactions: [] }]
    };

    newAccountName = "";
    newAccountBalance = 0;
  }
</script>

<h1 class="text-4xl text-heading mb-4">Accounts</h1>

<p>This is just a barebones implementation of account adding while the UI components are being written. Accounts can currently be deleted over in the testing area </p> 

<h2 class="text-2xl mb-2">Add Account</h2>

<div class="flex gap-3 items-end mb-6">
  <div class="flex flex-col">
    <label class="text-sm" for="account-name-input">Account Name</label>
    <input
      class="border px-2 py-1"
      bind:value={newAccountName}
      placeholder="Checking"
      id="account-name-input"
    />
  </div>

  <div class="flex flex-col">
    <label class="text-sm" for="starting-balance-input">Starting Balance</label>
    <input
      type="number"
      class="border px-2 py-1"
      bind:value={newAccountBalance}
      id="starting-balance-input"
    />
  </div>

  <Button onclick={addAccount}>
    Add
  </Button>
</div>

<h2 class="text-2xl mb-2 text-center">Existing Accounts</h2>
{#if accounts.length === 0}
  <EmptyState
    icon={PiggyBank}
    title="No Existing Accounts"
    description="Add an account"
    href="{resolve("/accounts")}"
  />
{:else}
<br/>
<div class="max-w-7xl mx-auto px-4">
  <div class="grid gap-6 justify-center [grid-template-columns:repeat(auto-fit,160px)]">
    {#each accounts as account}
      <AccountCard account={account} />
    {/each}
  </div>
</div>
<br/>
{/if}

