<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { ModeWatcher } from "mode-watcher";
	import { toggleMode } from "mode-watcher";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import * as Sheet from "$lib/components/ui/sheet";
	import Button from '$lib/components/ui/button/button.svelte';
	let { children } = $props();
</script>

<!-- <nav>
	<a href="{resolve("/")}">home</a>
	<a href="{resolve("/funding-sources")}">Funding</a>
	<a href="{resolve("/accounts")}">Accounts</a>
	<a href="{resolve("/allocations")}">Allocations</a>
	<Button onclick={toggleMode}>Dark Mode Toggle</Button>
</nav> -->

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Link href={resolve("/")}>
				Home
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href={resolve("/funding-sources")}>
				Funding
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href={resolve("/accounts")}>
				Accounts
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href={resolve("/allocations")}>
				Allocations
			</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
	<Button onclick={toggleMode}>Dark Mode Toggle</Button>
</NavigationMenu.Root>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher/>
{@render children?.()}