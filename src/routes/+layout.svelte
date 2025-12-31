<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { MobileNav } from '$lib/components/ui/mobile-nav/index.js';
  import { NavBar } from '$lib/components/ui/nav-bar/index.js';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header>
  <MobileNav />
  <NavBar />
</header>

<main class="pt-14">
  {@render children?.()}
</main>
