<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";

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
      "Funding Sources": [...budget.current["Funding Sources"], source]
    };

    budget.current["Funding Sources"] = budget.current["Funding Sources"];

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
    <label for="funding-source-name-input">Name</label>
    <input
      class="border px-2 py-1 w-full"
      bind:value={name}
      id="funding-source-name-input" 
    />
  </div>

  <div>
    <label for="funding-type-selector">Funding Type</label>
    <select class="border px-2 py-1 w-full" bind:value={fundingType} id="funding-type-selector">
      <option value="Hourly">Hourly</option>
      <option value="Salary">Salary</option>
    </select>
  </div>

  <div>
    <label for="pay-rate-input">Rate</label>
    <input
      type="number"
      class="border px-2 py-1 w-full"
      bind:value={rate}
      id="pay-rate-input"
    />
  </div>

  <div>
    <label for="pay-period-selector">Pay Period</label>
    <select class="border px-2 py-1 w-full" bind:value={period} id="pay-period-selector">
      <option>Weekly</option>
      <option>Biweekly</option>
      <option>Monthly</option>
      <option>Yearly</option>
      <option>One-time</option>
    </select>
  </div>

  {#if fundingType === "Hourly"}
    <div>
      <label for="hours-per-period-input">Hours Per Pay Period</label>
      <input
        type="number"
        class="border px-2 py-1 w-full"
        bind:value={hoursPerPayPeriod}
        id="hours-per-period-input"
      />
    </div>

    <div>
      <label for="first-pay-date-selector">First Pay Date</label>
      <input
        type="date"
        class="border px-2 py-1 w-full"
        bind:value={firstPayDate}
        id="first-pay-date-selector"
      />
    </div>

    <div>
      <label for="start-date-selector">Start Date</label>
      <input
        type="date"
        class="border px-2 py-1 w-full"
        bind:value={startDate}
        id="start-date-selector"
      />
    </div>

    <div>
      <label for="end-date-selector">End Date</label>
      <input
        type="date"
        class="border px-2 py-1 w-full"
        bind:value={endDate}
        id="end-date-selector"
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
    {#each budget.current["Funding Sources"] as src}
      <tr>
        <td class="border-b border-r px-4 py-2">{src["Name"]}</td>
        <td class="border-b border-r px-4 py-2">{src["Funding Type"]}</td>
        <td class="border-b border-r px-4 py-2">${src["Rate"]}</td>
        <td class="border-b px-4 py-2">{src["Pay Timing"]["Period"]}</td>
      </tr>
    {/each}
  </tbody>
</table>
