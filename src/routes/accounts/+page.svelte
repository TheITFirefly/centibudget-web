<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";

  let newAccountName = $state("");
  let newAccountBalance = $state(0);

  function addAccount() {
    if (!newAccountName.trim()) {
      alert("Account name is required");
      return;
    }

    const accounts = budget.current["Accounts"];

    const exists = accounts.some(
      acc => acc["Name"] === newAccountName
    );

    if (exists) {
      alert("An account with this name already exists");
      return;
    }

    const newAccount = {
      Name: newAccountName,
      Balance: Number(newAccountBalance),
      Transactions: []
    };

    budget.current = {
      ...budget.current,
      Accounts: [...accounts, newAccount]
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

<h2 class="text-2xl mb-2">Existing Accounts</h2>

<table class="table-auto border-collapse border w-full">
  <thead>
    <tr>
      <th class="border-b border-r px-4 py-2">Name</th>
      <th class="border-b px-4 py-2">Balance</th>
    </tr>
  </thead>
  <tbody>
    {#each budget.current["Accounts"] as account}
      <tr>
        <td class="border-b border-r px-4 py-2">
          {account["Name"]}
        </td>
        <td class="border-b px-4 py-2">
          ${account["Balance"]}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
