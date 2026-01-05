<script>
  import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { DarkModeButton } from '$lib/components/ui/dark-mode-button/index.js';

  const pathname = $derived(page.url.pathname);
  const isActive = (path) =>
    pathname === path || pathname.startsWith(`${path}/`);

</script>

<NavigationMenu.Root
  class="bg-background fixed top-0 shadow-md w-full max-w-full hidden sm:flex py-1"
>
  <NavigationMenu.List class="flex items-center gap-2">
    <NavigationMenu.Item>
      <NavigationMenu.Link
        href={resolve("/")}
        class={isActive("/") ? "text-primary font-semibold bg-accent" : ""}
        aria-current={isActive("/") ? "page" : undefined}
      >
        Home
      </NavigationMenu.Link>
    </NavigationMenu.Item>

    <NavigationMenu.Item>
      <NavigationMenu.Link
        href={resolve("/funding-sources")}
        class={isActive("/funding-sources") ? "text-primary font-semibold bg-accent" : ""}
        aria-current={isActive("/funding-sources") ? "page" : undefined}
      >
        Funding
      </NavigationMenu.Link>
    </NavigationMenu.Item>

    <NavigationMenu.Item>
      <NavigationMenu.Link
        href={resolve("/accounts")}
        class={isActive("/accounts") ? "text-primary font-semibold bg-accent" : ""}
        aria-current={isActive("/accounts") ? "page" : undefined}
      >
        Accounts
      </NavigationMenu.Link>
    </NavigationMenu.Item>

    <NavigationMenu.Item>
      <NavigationMenu.Link
        href={resolve("/allocations")}
        class={isActive("/allocations") ? "text-primary font-semibold bg-accent" : ""}
        aria-current={isActive("/allocations") ? "page" : undefined}
      >
        Allocations
      </NavigationMenu.Link>
    </NavigationMenu.Item>

    <NavigationMenu.Item>
      <NavigationMenu.Link
        href={resolve("/testing")}
        class={isActive("/testing") ? "text-primary font-semibold bg-accent" : ""}
        aria-current={isActive("/accounts") ? "page" : undefined}
      >
        Testing Area
      </NavigationMenu.Link>
    </NavigationMenu.Item>

    <DarkModeButton />
  </NavigationMenu.List>
</NavigationMenu.Root>
