<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { budget } from "$lib/shared.svelte";
  import { validateBudget } from "$lib/utils";
//   console.log(budget.current.Accounts[0])
//   TODO: begin implementing classes and stuff for each 
//   console.log(typeof budget.current.Accounts[0].Transactions[0])

  let text = $state(JSON.stringify(budget.current, null, 2));

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
	    console.error(result.errors);
		alert("Schema validation failed");
		return;
	  }
	  budget.current = parsed;
    } catch {
	  alert("Invalid JSON");
	}
  }
</script>

<p>Hey there! If you found this, I haven't quite finished up with the dashboard or any UI stuff yet.</p>
<p>This page right now is just for testing whether or not your budget matches the known schema</p>
<p>Press import to test your current schema, and reload to load something fresh.</p>
<p>Data persists to localstorage. To clear it open up a console in dev tools and run this command:</p>
<p>localStorage.removeItem("Budget")</p>
<p>Happy testing! :)</p>

<Textarea
  bind:value={text}
  class="min-h-144 font-mono"
  spellcheck="false"
/>

<div class="flex gap-2">
  <Button onclick={importJson}>Import</Button>
  <Button onclick={reloadFromStorage}>Reload</Button>
</div>
