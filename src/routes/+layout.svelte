<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	let { children } = $props();
</script>

<nav>
	<a href="{resolve("/")}">home</a>
	<a href="{resolve("/funding-sources")}">Funding</a>
	<a href="{resolve("/accounts")}">Accounts</a>
	<a href="{resolve("/allocations")}">Allocations</a>
</nav>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
