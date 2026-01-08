<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";

  let sources = $state(budget.current["Funding Sources"]);

  let name = $state("");
  let fundingType = $state<"Hourly" | "Salary">("Hourly");
  let rate = $state(0);

  let startDate = $state<string | null>(null);
  let firstPayDate = $state<string | null>(null);
  let endDate = $state<string | null>(null);

  let period = $state("Biweekly");
  let hoursPerPayPeriod = $state<number | null>(40);

  // Enforce business rules
  $effect(() => {
    if (fundingType === "Salary") {
      hoursPerPayPeriod = null;
    }

    if (fundingType === "Hourly" && hoursPerPayPeriod === null) {
      hoursPerPayPeriod = 40;
    }

    if (fundingType === "Salary") {
      startDate = null;
      endDate = null;
    }
  });

  function addFundingSource() {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!firstPayDate && fundingType === "Hourly") {
      alert("First pay date is required");
      return;
    }

    const source = {
      Name: name,
      "Funding Type": fundingType,
      Rate: Number(rate),
      "Pay Timing": {
        "Start Date": startDate,
        ...(firstPayDate ? { "First Pay Date": firstPayDate } : {}),
        Period: period,
        "End Date": endDate
      },
      "Hours Per Pay Period": hoursPerPayPeriod
    };

    budget.current = {
      ...budget.current,
      "Funding Sources": [...sources, source]
    };

    sources = budget.current["Funding Sources"];

    // Reset
    name = "";
    fundingType = "Hourly";
    rate = 0;
    startDate = null;
    firstPayDate = null;
    endDate = null;
    period = "Biweekly";
    hoursPerPayPeriod = 40;
  }
</script>

<h1 class="text-4xl text-heading mb-4">Funding Sources</h1>
<p>This is just a barebones implementation of funding source adding while the UI components are being written. Funding sources can currently be deleted over in the testing area </p> 

<h2 class="text-2xl mb-2">Add Funding Source</h2>

<div class="grid grid-cols-2 gap-4 max-w-2xl mb-6">
  <div>
    <label>Name</label>
    <input class="border px-2 py-1 w-full" bind:value={name} />
  </div>

  <div>
    <label>Funding Type</label>
    <select class="border px-2 py-1 w-full" bind:value={fundingType}>
      <option value="Hourly">Hourly</option>
      <option value="Salary">Salary</option>
    </select>
  </div>

  <div>
    <label>Rate</label>
    <input
      type="number"
      class="border px-2 py-1 w-full"
      bind:value={rate}
    />
  </div>

  <div>
    <label>Pay Period</label>
    <select class="border px-2 py-1 w-full" bind:value={period}>
      <option>Weekly</option>
      <option>Biweekly</option>
      <option>Monthly</option>
      <option>Yearly</option>
      <option>One-time</option>
    </select>
  </div>

  {#if fundingType === "Hourly"}
    <div>
      <label>Hours Per Pay Period</label>
      <input
        type="number"
        class="border px-2 py-1 w-full"
        bind:value={hoursPerPayPeriod}
      />
    </div>

    <div>
      <label>First Pay Date</label>
      <input
        type="date"
        class="border px-2 py-1 w-full"
        bind:value={firstPayDate}
      />
    </div>

    <div>
      <label>Start Date</label>
      <input
        type="date"
        class="border px-2 py-1 w-full"
        bind:value={startDate}
      />
    </div>

    <div>
      <label>End Date</label>
      <input
        type="date"
        class="border px-2 py-1 w-full"
        bind:value={endDate}
      />
    </div>
  {/if}
</div>

<Button onclick={addFundingSource}>Add Funding Source</Button>

<h2 class="text-2xl mt-8 mb-2">Existing Sources</h2>

<table class="table-auto border-collapse border w-full">
  <thead>
    <tr>
      <th class="border-b border-r px-4 py-2 text-left">Name</th>
      <th class="border-b border-r px-4 py-2">Type</th>
      <th class="border-b border-r px-4 py-2">Rate</th>
      <th class="border-b px-4 py-2">Period</th>
    </tr>
  </thead>
  <tbody>
    {#each sources as src}
      <tr>
        <td class="border-b border-r px-4 py-2">{src["Name"]}</td>
        <td class="border-b border-r px-4 py-2">{src["Funding Type"]}</td>
        <td class="border-b border-r px-4 py-2">${src["Rate"]}</td>
        <td class="border-b px-4 py-2">{src["Pay Timing"]["Period"]}</td>
      </tr>
    {/each}
  </tbody>
</table>
