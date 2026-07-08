<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { asset } from '$app/paths';
	import { MobileNav } from '$lib/components/ui/mobile-nav/index.js';
	import { NavBar } from '$lib/components/ui/nav-bar/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href={asset(`/manifest.webmanifest`)} />
	<link rel="apple-touch-icon" href={asset(`/icons/apple-touch-icon.png`)} />
</svelte:head>

<header>
	<MobileNav />
	<NavBar />
</header>

<main class="pt-14">
	{@render children?.()}
</main>
