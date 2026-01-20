<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";

  let allocations = budget.current["Allocations"];
  let accounts = budget.current["Accounts"];

  let name = $state("");
  let type = $state<"Fixed" | "Percentage" | "Subscription">("Fixed");
  let period = $state("One-time");
  let amount = $state(0);
  let account = $state("");
  let lastPaid = $state<string | null>(null);

  // Reactively enforce rules based on Type
  $effect(() => {
    switch (type) {
      case "Fixed":
        if (period !== "One-time") period = "One-time";
        if (lastPaid !== null) lastPaid = null;
        break;

      case "Percentage":
        if (period !== "Constant") period = "Constant";
        if (lastPaid !== null) lastPaid = null;
        break;

      case "Subscription":
        if (!["Weekly", "Biweekly", "Monthly", "Yearly"].includes(period)) {
          period = "Monthly";
        }
        break;
    }
  });

  function addAllocation() {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!account) {
      alert("Account is required");
      return;
    }

    const allocation = {
      Name: name,
      Type: type,
      Period: period,
      "Last Paid": type === "Subscription" ? lastPaid : null,
      Amount: Number(amount),
      Account: account
    };

    budget.current = {
      ...budget.current,
      Allocations: [...allocations, allocation]
    };

    allocations = budget.current["Allocations"];

    // Reset
    name = "";
    type = "Fixed";
    period = "One-time";
    amount = 0;
    account = "";
    lastPaid = null;
  }
</script>

<h1 class="text-4xl text-heading mb-4">Allocations</h1>
<p>This is just a barebones implementation of allocation adding while the UI components are being written. Allocations can currently be deleted over in the testing area </p> 

<h2 class="text-2xl mb-2">Add Allocation</h2>

<div class="grid grid-cols-2 gap-4 mb-6 max-w-xl">
  <div>
    <label for="allocation-name-input">Name</label>
    <input
      class="border px-2 py-1 w-full"
      bind:value={name}
      id="allocation-name-input"
    />
  </div>

  <div>
    <label for="allocation-type-selector">Type</label>
    <select class="border px-2 py-1 w-full" bind:value={type} id="allocation-type-selector">
      <option value="Fixed">Fixed</option>
      <option value="Percentage">Percentage</option>
      <option value="Subscription">Subscription</option>
    </select>
  </div>

  {#if type === "Subscription"}
    <div>
      <label for="subscription-period-selector">Period</label>
      <select class="border px-2 py-1 w-full" bind:value={period} id="subscription-period-selector">
        <option>Weekly</option>
        <option>Biweekly</option>
        <option>Monthly</option>
        <option>Yearly</option>
      </select>
    </div>

    <div>
      <label for="subscription-last-paid-selector">Last Paid</label>
      <input
        type="date"
        class="border px-2 py-1 w-full"
        bind:value={lastPaid}
        id="subscription-last-paid-selector"
      />
    </div>
  {/if}

  <div>
    <label for="allocation-amount-input">Amount</label>
    <input
      type="number"
      class="border px-2 py-1 w-full"
      bind:value={amount}
      id="allocation-amount-input"
    />
  </div>

  <div>
    <label for="allocation-account-selector">Account</label>
    <select class="border px-2 py-1 w-full" bind:value={account} id="allocation-account-selector">
      <option value="" disabled>Select account</option>
      {#each accounts as acc}
        <option value={acc["Name"]}>{acc["Name"]}</option>
      {/each}
    </select>
  </div>
</div>

<Button onclick={addAllocation}>Add Allocation</Button>
