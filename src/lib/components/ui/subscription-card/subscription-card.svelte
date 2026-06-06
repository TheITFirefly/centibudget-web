<script>
  import { formatCurrency, formatDate, formatDays } from "$lib/formatters";
	import { Pencil, Trash, Check, X } from "lucide-svelte";
	import Button from "../button/button.svelte";
  import { budget } from "$lib/shared.svelte";
  let { subscription, showActions=false } = $props();

  let confirmDelete = $state(false);

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

  function deleteSubscriptionCard() {
    if (!confirmDelete) {
      confirmDelete = true;
      return;
    }

    // actual delete logic
    let allocations = budget.current["Allocations"];
    let newAllocations = allocations.filter(
      toRemove => toRemove["Name"] !== subscription["Name"]
    );

    budget.current = {
      ...budget.current,
      Allocations: newAllocations
    };
  }

  function cancelDelete() {
    confirmDelete = false;
  }

  function editSubscriptionCard() {
    console.log("Not yet implemented");
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

  {#if showActions}
  <!-- Divider -->
  <div class="w-px bg-border"></div>

  <!-- Edit and Delete Buttons-->
     <div class="w-28 flex flex-col items-center justify-center text-xs">
    
    <div>
      {#if confirmDelete}
        <Button variant="ghost" onclick={cancelDelete}>
          <X/>
        </Button>
      {:else}        
      <Button variant="ghost" onclick={editSubscriptionCard}>
        <Pencil/>
      </Button>
      {/if}
    </div>

    <div class="w-full border-t my-1"></div>

    <div>
      <Button variant="ghost" onclick={deleteSubscriptionCard}>
        {#if confirmDelete}
          <Check/>
        {:else}
          <Trash/>
        {/if}
      </Button>
    </div>

  </div>
  {/if}
</div>
