<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";
  import { validateBudget } from "$lib/utils";
//   console.log(budget.current.Accounts[0])
//   TODO: begin implementing classes and stuff for each 
//   console.log(typeof budget.current.Accounts[0].Transactions[0])

  let text = $state(JSON.stringify(budget.current, null, 2));
  let importstatus = $state(false);

  function reloadFromStorage() {
	const value = budget.current;
	if (value === null) {
	  text = "localStorage is empty. Please reload the page to repopulate localStorage with an empty budget";
	} else {
	  text = JSON.stringify(value, null, 2);
	}
  }

  function importJson() {
    try {
      const parsed = JSON.parse(text);
      const result = validateBudget(parsed);

      if (!result.valid) {
        importstatus = false;
        console.error(result.errors);
        alert("Schema validation failed");
        return;
      }

      budget.current = parsed;
      importstatus = true;
    } catch {
      importstatus = false;
      alert("Invalid JSON");
    }
  }
</script>
<div class="p-2">
<p>Hey there! If you found this, the fancy UI isn't quite finished yet, but it is being worked on.</p>
<p>Right now this page is for testing if your budget matches the known schema, and deleting stuff from your budget</p>
<p>Press import to import the budget in the text area, or reload (after clearing local storage) to load a fresh budget without anything in it.</p>
<br/>
<p>Data persists to localstorage. To clear it open up a console in dev tools and run this command:</p>
<p>localStorage.removeItem("Budget")</p>
<br/>
<p>Happy testing! :)</p>

{#if importstatus}
  <p class="text-green-600 font-medium">
    Import successful!
  </p>
{/if}

<Textarea
  bind:value={text}
  class="min-h-60 font-mono"
  spellcheck="false"
/>


<div class="flex gap-2">
  <Button onclick={importJson}>Import</Button>
  <Button onclick={reloadFromStorage}>Reload</Button>
</div>
</div>