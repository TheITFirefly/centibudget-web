<script lang="ts">
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';
	import { SunIcon, MoonIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<Button
	onclick={toggleMode}
	variant="outline"
	size="icon"
	aria-label={`Switch to ${mode.current === 'dark' ? 'light' : 'dark'} mode`}
	aria-pressed={mode.current === 'dark'}
>
	<MoonIcon
		class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
		aria-hidden="true"
	/>
	<SunIcon
		class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
		aria-hidden="true"
	/>

	<ModeWatcher />
</Button>
