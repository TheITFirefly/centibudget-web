<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { resolve } from '$app/paths';
	import { Menu } from 'lucide-svelte';
	import { X } from 'lucide-svelte';
  import { afterNavigate } from '$app/navigation';
	import { DarkModeButton } from '$lib/components/ui/dark-mode-button/index.js';

  //Make Navigation Menu close on navigation  in mobile devices
  let open = $state(false);
  afterNavigate(()=>{
    open = false;
  });

  //Prevent scrolling if the menu is open
  $effect(() => {
	  document.body.style.overflow = open ? 'hidden' : '';
  });

</script>
<nav class="fixed top-0 w-full bg-background sm:hidden">
  <div class="flex items-center justify-between px-4 py-2 shadow-md">
  <Popover.Root bind:open>
		<Popover.Trigger>
			<Button variant="outline" size="icon" aria-label="Toggle menu">
				{#if open}
					<X />
				{:else}
					<Menu />
				{/if}
			</Button>
		</Popover.Trigger>
			<Popover.Content sideOffset=1 class="bg-background/95 w-(--bits-popover-content-available-width) h-(--bits-popover-content-available-height) rounded-none border-none sm:hidden">
				<a href={resolve("/")} class="block text-2xl font-medium">Home</a>
				<a href={resolve("/funding-sources")} class="block text-2xl font-medium">Funding</a>
				<a href={resolve("/accounts")} class="block text-2xl font-medium">Accounts</a>
				<a href={resolve("/allocations")} class="block text-2xl font-medium">Allocations</a>
				<a href={resolve("/testing")} class="block text-2xl font-medium">Testing Area</a>
			</Popover.Content>
	</Popover.Root>
  <DarkModeButton></DarkModeButton>
  </div>
</nav>