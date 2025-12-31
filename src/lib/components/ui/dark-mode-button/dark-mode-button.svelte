<script>
	import { ModeWatcher } from "mode-watcher";
	import { toggleMode } from "mode-watcher";
	import { SunIcon } from 'lucide-svelte';
	import { MoonIcon } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
    <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"/>
    <SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"/>
    <span class="sr-only">Toggle Dark Mode</span>
    <ModeWatcher/>
</Button>
