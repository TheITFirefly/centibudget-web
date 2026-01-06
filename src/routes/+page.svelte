<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";
  let budgetObject = $state(budget.current);
  let income = budgetObject['Funding Sources'];
  let allocations = budgetObject['Allocations'];
  let savingsGoals = allocations.filter(allocation => allocation['Type'] === "Fixed");
  let subscriptions = allocations.filter(allocation => allocation['Type'] === "Subscription")
  let accounts = budgetObject['Accounts'];

  // Function to get the balance of an account based on the account name
  function getAccountBalance(accountName) {
    const account = accounts.find(acc => acc['Name'] === accountName);
    return account ? account.Balance : 0; // Default to 0 if no matching account
  }

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

<h1 class="text-4xl text-heading">Dashboard</h1>
This is just a barebones implementation of the data viewing that will happen once all of the UI components are written

<h2 class="text-3xl text-heading">Income</h2>
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

<h2 class="text-3xl text-heading">Savings Goals</h2>
<table class="table-auto border-collapse border">
  <thead>
    <tr>
      <th class="border-b border-r px-4 py-2">Goal Name</th>
      <th class="border-b border-r px-4 py-2">Amount Needed</th>
      <th class="border-b border-r px-4 py-2">Amount Saved</th>
    </tr>
  </thead>
  <tbody>
    {#each savingsGoals as savingsGoal}
      <tr>
        <td class="border-b border-r px-4 py-2">{ savingsGoal["Name"] }</td>
        <td class="border-b border-r px-4 py-2">{ savingsGoal["Amount"] }</td>
        <td class="border-b border-r px-4 py-2">{ getAccountBalance(savingsGoal["Account"]) }</td>
      </tr>
    {/each}
  </tbody>
</table>

<h2 class="text-3xl text-heading">Subscriptions</h2>
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

<h2 class="text-3xl text-heading">Accounts</h2>
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
