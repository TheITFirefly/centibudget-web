<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";
  let income = budget.current['Funding Sources'];
  let allocations = budget.current['Allocations'];
  let savingsGoals = allocations.filter(allocation => allocation['Type'] === "Fixed");
  let subscriptions = allocations.filter(allocation => allocation['Type'] === "Subscription")
  let accounts = budget.current['Accounts'];

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

  function getProgress(goal) {
  const saved = getAccountBalance(goal["Account"]);
  const total = goal["Amount"];
  if (!total) return 0;
  return Math.min(100, Math.round((saved / total) * 100));
}
</script>

<h1 class="text-4xl text-heading text-center">Dashboard</h1>
<p class="text-center">This is just a barebones implementation of the data viewing that will happen once all of the UI components are written</p>

<h2 class="text-3xl text-heading text-center">Income</h2>
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

<h2 class="text-3xl text-heading text-center">Savings Goals</h2>
<br/>
<div class="max-w-7xl mx-auto px-4">
  <div class="grid gap-6 justify-center [grid-template-columns:repeat(auto-fit,128px)]">
    {#each savingsGoals as savingsGoal}
      {@const progress = getProgress(savingsGoal)}
      <div
        class="h-40 border rounded-lg flex flex-col overflow-hidden transition-all duration-300">

        <!-- Header -->
        <div class="text-center font-semibold py-2 border-b">
          {savingsGoal["Name"]}
        </div>

        <!-- Bucket -->
        <div class="relative flex-1 overflow-hidden">
          <div
            class="absolute bottom-0 left-0 w-full bg-primary transition-all duration-300
            rounded-t-md
            {progress === 100 ? 'animate-pulse-slow' : ''}"
            style="height: {progress}%"
          ></div>
        </div>

        <!-- Footer -->
        <div class="text-center text-sm py-2 border-t">
          ${getAccountBalance(savingsGoal["Account"])}
          /
          ${savingsGoal["Amount"]}
          ({progress}%)
        </div>

      </div>
    {/each}
  </div>
</div>

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
