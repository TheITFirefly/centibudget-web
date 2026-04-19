<script>
  import { formatCurrency, formatDate, formatDays } from "$lib/formatters";
  let { subscription } = $props();

  function calculateNextPayDate(lastPaidDate, period) {
    const date = new Date(`${lastPaidDate}T00:00:00`);
    const next = new Date(date);

    if (period === "Weekly") next.setDate(date.getDate() + 7);
    else if (period === "Biweekly") next.setDate(date.getDate() + 14);
    else if (period === "Monthly") next.setMonth(date.getMonth() + 1);
    else if (period === "Yearly") next.setFullYear(date.getFullYear() + 1);

    return next;
  }

  function daysUntil(date) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const diff = date - today;
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
  }

  const nextPayDate = $derived.by(() => {
    if (!subscription["Last Paid"]) return null;

    return calculateNextPayDate(
      subscription["Last Paid"],
      subscription["Period"]
    );
  });

  const daysLeft = $derived(
    nextPayDate ? daysUntil(nextPayDate) : 0
  );

  const formattedDate = $derived(formatDate(nextPayDate));
  const formattedAmount = $derived(formatCurrency(subscription["Amount"]));
  const formattedDays = $derived(formatDays(daysLeft));
</script>

<div class="w-80 h-24 border rounded-lg flex overflow-hidden transition-all duration-300 hover:shadow-sm">
  
  <!-- Left: Name -->
  <div class="flex-1 flex items-center justify-center px-3 text-sm font-semibold">
    {subscription["Name"]}
  </div>

  <!-- Divider -->
  <div class="w-px bg-border"></div>

  <!-- Middle: Amount -->
  <div class="w-24 flex items-center justify-center text-sm font-medium">
    {formattedAmount}
  </div>

  <!-- Divider -->
  <div class="w-px bg-border"></div>

  <!-- Right: Date + Days -->
  <div class="w-28 flex flex-col items-center justify-center text-xs">
    
    <div>
      {formattedDate}
    </div>

    <div class="w-3/4 border-t my-1"></div>

    <div class="text-muted-foreground">
      {formattedDays}
    </div>

  </div>

</div>
