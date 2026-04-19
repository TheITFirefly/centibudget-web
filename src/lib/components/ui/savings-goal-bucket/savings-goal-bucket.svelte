<script>
  import { budget } from "$lib/shared.svelte";

  let { goal } = $props();

  const accounts = $derived(budget.current["Accounts"]);

  const balance = $derived(
    accounts.find(acc => acc["Name"] === goal["Account"])?.["Balance"] ?? 0
  );

  const progress = $derived.by(() => {
    const total = goal["Amount"];
    if (!total) return 0;

    return Math.min(100, Math.round((balance / total) * 100));
  });
</script>

<div class="h-40 border rounded-lg flex flex-col overflow-hidden transition-all duration-300">
  
  <!-- Header -->
  <div class="text-center font-semibold py-2 border-b">
    {goal["Name"]}
  </div>

  <!-- Bucket -->
  <div class="relative flex-1 overflow-hidden">
    <div
      class="absolute bottom-0 left-0 w-full bg-primary transition-all duration-300 rounded-t-md"
      class:animate-pulse-slow={progress === 100}
      style="height: {progress}%"
    ></div>
  </div>

  <!-- Footer -->
  <div class="text-center text-sm py-2 border-t">
    ${balance}
    /
    ${goal["Amount"]}
    ({progress}%)
  </div>

</div>
