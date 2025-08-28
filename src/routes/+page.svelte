<script>
	let name = $state('world');
	let count = $state(0);
</script>

<h1>Hello {name}!</h1>

<input bind:value={name} />
<button onclick={() => count += 1}>
	clicks: {count}
</button>
<p>This page will contain a dashboard to see a summary of everything, and ways to edit everything</p>