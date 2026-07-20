<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { type LucideIcon } from '@lucide/svelte';

	let {
		icon: IconComponent,
		title,
		description,
		href
	}: {
		icon: LucideIcon;
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
			{description} <a {href}>here</a>
		</Empty.Description>
	</Empty.Content>
</Empty.Root>
