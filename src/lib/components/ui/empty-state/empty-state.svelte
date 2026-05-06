<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import type { Component } from 'svelte';

	// Props using Svelte 5 $props() rune
	let {
		icon: IconComponent,
		title,
		description,
		href
	}: {
		icon: Component;
		title: string;
		description: string;
		href: string;
	} = $props();
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			<IconComponent />
		</Empty.Media>
		<Empty.Title>{title}</Empty.Title>
	</Empty.Header>
	<Empty.Content>
		<Empty.Description>
			{description} <a href={resolve(href)}>here</a>
		</Empty.Description>
	</Empty.Content>
</Empty.Root>
