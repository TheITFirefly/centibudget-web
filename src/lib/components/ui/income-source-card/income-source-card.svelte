<script>
  import { formatDate, formatDays } from "$lib/formatters";
  let { source } = $props();

  function calculateNextPayDate(firstPayDate, period) {
    const date = new Date(firstPayDate);
    const next = new Date(date);

    if (period === "Weekly") next.setDate(date.getDate() + 7);
    else if (period === "Biweekly") next.setDate(date.getDate() + 14);
    else if (period === "Monthly") next.setMonth(date.getMonth() + 1);
    else if (period === "Yearly") next.setFullYear(date.getFullYear() + 1);

    return next;
  }

  function daysUntil(date) {
    const today = new Date();
    today.setHours(0,0,0,0)
    const diff = date - today;
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
  }

  const nextPayDate = $derived.by(() => {
    const timing = source["Pay Timing"];
    if (!timing?.["First Pay Date"]) return null;

    return calculateNextPayDate(
      timing["First Pay Date"],
      timing["Period"]
    );
  });

  const daysLeft = $derived(
    nextPayDate ? daysUntil(nextPayDate) : 0
  );
const formattedDate = $derived(formatDate(nextPayDate));
const formattedDays = $derived(formatDays(daysLeft));

</script>

<div class="w-64 h-24 border rounded-lg flex overflow-hidden transition-all duration-300 hover:shadow-sm bg-card">
  
  <!-- Left -->
  <div class="flex-1 flex items-center justify-center px-3 text-sm font-semibold">
    {source["Name"]}
  </div>

  <!-- Vertical divider -->
  <div class="w-px bg-border"></div>

  <!-- Right -->
  <div class="w-28 flex flex-col items-center justify-center text-xs">
    
    <!-- Date -->
    <div>
      {formattedDate}
    </div>

    <!-- Partial divider -->
    <div class="w-3/4 border-t my-1"></div>

    <!-- Days -->
    <div class="text-muted-foreground">
      {formattedDays}
    </div>

  </div>

</div>