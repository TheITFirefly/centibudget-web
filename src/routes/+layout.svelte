<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<nav>
	<a href="/">home</a>
	<a href="/funding-sources">Funding</a>
	<a href="/accounts">Accounts</a>
	<a href="/allocations">Allocations</a>
</nav>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
