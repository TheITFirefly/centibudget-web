<script>
	import { resolve } from '$app/paths';
  import * as Empty from "$lib/components/ui/empty/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import SavingsGoalBucket from '$lib/components/ui/savings-goal-bucket/savings-goal-bucket.svelte';
	import { Target, PiggyBank, CalendarSync, BanknoteArrowUp } from 'lucide-svelte';
  import { budget } from "$lib/shared.svelte";
  let income = budget.current['Funding Sources'];
  let allocations = budget.current['Allocations'];
  let savingsGoals = allocations.filter(allocation => allocation['Type'] === "Fixed");
  let subscriptions = allocations.filter(allocation => allocation['Type'] === "Subscription")
  let accounts = budget.current['Accounts'];

  function calculateNextPayDate(lastPaidDate, period) {
    const lastPaid = new Date(lastPaidDate);
    let nextPayDate = new Date(lastPaid);

    if (period === "Biweekly") {
      nextPayDate.setDate(lastPaid.getDate() + 30);
    }
    // TODO: make this aware of the different periods a subscription can have

    return nextPayDate;
  }

  function daysUntilNextPayDate(nextPayDate) {
    const today = new Date();
    const timeDifference = nextPayDate - today;
    return Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
  }
</script>

<h1 class="text-4xl text-heading text-center">Dashboard</h1>
<p class="text-center">This is just a barebones implementation of the data viewing that will happen once all of the UI components are written</p>

<h2 class="text-3xl text-heading text-center">Income</h2>
{#if income.length === 0}
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <BanknoteArrowUp/>
    </Empty.Media>
    <Empty.Title>No Income sources</Empty.Title>
  </Empty.Header>
  <Empty.Content>
    <Empty.Description>
      Add an income source <a href={resolve("/funding-sources")}>here</a>
    </Empty.Description>
  </Empty.Content>
</Empty.Root>
{:else}
<table class="table-auto border-collapse border">
  <thead>
    <tr>
      <th class="border-b border-r px-4 py-2">Name</th>
      <th class="border-b border-r px-4 py-2">Next Pay Date</th>
      <th class="border-b border-r px-4 py-2">Days Until Next Pay Date</th>
    </tr>
  </thead>
  <tbody>
    {#each income as source}
      <tr>
        <td class="border-b border-r px-4 py-2">{ source["Name"] }</td>
        <td class="border-b border-r px-4 py-2">{ source["Pay Timing"]["First Pay Date"] }</td>
        <td class="border-b border-r px-4 py-2">{ daysUntilNextPayDate(source["Pay Timing"]["First Pay Date"]) }</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}

<h2 class="text-3xl text-heading text-center">Savings Goals</h2>
{#if savingsGoals.length === 0}
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <Target/>
    </Empty.Media>
    <Empty.Title>No Savings Goals</Empty.Title>
  </Empty.Header>
  <Empty.Content>
    <Empty.Description>
      Add a savings goal <a href={resolve("/allocations")}>here</a>
    </Empty.Description>
  </Empty.Content>
</Empty.Root>
{:else}
<br/>
<div class="max-w-7xl mx-auto px-4">
  <div class="grid gap-6 justify-center [grid-template-columns:repeat(auto-fit,128px)]">
    {#each savingsGoals as savingsGoal}
      <SavingsGoalBucket goal={savingsGoal} />
    {/each}
  </div>
</div>
{/if}

<h2 class="text-3xl text-heading text-center">Subscriptions</h2>
{#if subscriptions.length === 0}
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <CalendarSync/>
    </Empty.Media>
    <Empty.Title>No Subscriptions</Empty.Title>
  </Empty.Header>
  <Empty.Content>
    <Empty.Description>
      Add a subscription <a href={resolve("/allocations")}>here</a>
    </Empty.Description>
  </Empty.Content>
</Empty.Root>
{:else}
Days until next pay date currently assumes monthly (30 days)
<table class="table-auto border-collapse border">
  <thead>
    <tr>
      <th class="border-b border-r px-4 py-2">Name</th>
      <th class="border-b border-r px-4 py-2">Amount</th>
      <th class="border-b border-r px-4 py-2">Next Pay Date</th>
      <th class="border-b border-r px-4 py-2">Days Until Next Pay Date</th>
    </tr>
  </thead>
  <tbody>
    {#each subscriptions as subscription}
      <tr>
        <td class="border-b border-r px-4 py-2">{ subscription["Name"] }</td>
        <td class="border-b border-r px-4 py-2">${ subscription["Amount"] }</td>
        <td class="border-b border-r px-4 py-2">{ calculateNextPayDate(subscription["Last Paid"], subscription["Period"]).toLocaleDateString() }</td>
        <td class="border-b border-r px-4 py-2">{ daysUntilNextPayDate(calculateNextPayDate(subscription["Last Paid"], subscription["Period"])) }</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}

<h2 class="text-3xl text-heading text-center">Accounts</h2>
{#if accounts.length === 0}
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <PiggyBank/>
    </Empty.Media>
    <Empty.Title>No Accounts</Empty.Title>
  </Empty.Header>
  <Empty.Content>
    <Empty.Description>
      Add an account <a href={resolve("/accounts")}>here</a>
    </Empty.Description>
  </Empty.Content>
</Empty.Root>
{:else}
<table class="table-auto border-collapse border">
  <thead>
    <tr>
      <th class="border-b border-r px-4 py-2">Account Name</th>
      <th class="border-b border-r px-4 py-2">Balance</th>
    </tr>
  </thead>
  <tbody>
    {#each accounts as account}
      <tr>
        <td class="border-b border-r px-4 py-2">{ account["Name"] }</td>
        <td class="border-b border-r px-4 py-2">{ account["Balance"] }</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
