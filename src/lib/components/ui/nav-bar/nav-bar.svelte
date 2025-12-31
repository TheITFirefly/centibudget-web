<script>
	import { resolve } from '$app/paths';
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { DarkModeButton } from '$lib/components/ui/dark-mode-button/index.js';
</script>

<NavigationMenu.Root class="bg-background fixed top-0 shadow-md w-full max-w-full hidden sm:flex py-1">
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
	<DarkModeButton></DarkModeButton>
  </NavigationMenu.List>
</NavigationMenu.Root>
