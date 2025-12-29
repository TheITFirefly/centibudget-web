<script lang="ts">
  //All the Imports
  import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { ModeWatcher } from "mode-watcher";
	import { toggleMode } from "mode-watcher";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import Button from '$lib/components/ui/button/button.svelte';
	import { SunIcon } from 'lucide-svelte';
	import { MoonIcon } from 'lucide-svelte';
	import { Menu } from 'lucide-svelte';
	import { X } from 'lucide-svelte';

  //Make Navigation Menu close on navigation  in mobile devices
  import { afterNavigate } from '$app/navigation';
  let mobileMenuOpen = $state(false);
  afterNavigate(()=>{
    mobileMenuOpen = false;
  });

  //Prevent scrolling if the menu is open

  let { children } = $props();
  $effect(() => {
	  document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  });

</script>

<div class="fixed top-0 flex w-full items-center justify-between bg-background sm:hidden">

  <Popover.Root bind:open={mobileMenuOpen}>
		<Popover.Trigger>
			<Button variant="outline" size="icon" aria-label="Toggle menu">
				{#if mobileMenuOpen}
					<X />
				{:else}
					<Menu />
				{/if}
			</Button>
		</Popover.Trigger>

		<Popover.Content
			class="bg-background/90 no-scrollbar
            h-(--bits-popover-content-available-height)
            w-(--bits-popover-content-available-width)
            overflow-y-auto rounded-none border-none p-0
            shadow-none backdrop-blur duration-100"
      >
			<a href={resolve("/")} class="block text-2xl font-medium">Home</a>
			<a href={resolve("/funding-sources")} class="block text-2xl font-medium">Funding</a>
			<a href={resolve("/accounts")} class="block text-2xl font-medium">Accounts</a>
			<a href={resolve("/allocations")} class="block text-2xl font-medium">Allocations</a>
		</Popover.Content>
	</Popover.Root>

	<Button
		onclick={toggleMode}
		variant="outline"
		size="icon"
		aria-label="Toggle Dark Mode"
	>
		<MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
		<SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
	</Button>
</div>


<!--Regular navigation menu-->
<NavigationMenu.Root class="bg-background fixed top-0 shadow-md w-full max-w-full hidden sm:flex">
<NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Link href={resolve("/")}>Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href={resolve("/funding-sources")}>Funding</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href={resolve("/accounts")}>Accounts</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href={resolve("/allocations")}>Allocations</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <Button onclick={toggleMode} variant="outline" size="icon">
	<MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"/>
    <SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"/>
	<span class="sr-only">Toggle Dark Mode</span>
  </Button>
</NavigationMenu.Root>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher/>
{@render children?.()}
