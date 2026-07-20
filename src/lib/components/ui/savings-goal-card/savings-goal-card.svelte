<script lang="ts">
	import { budget } from '$lib/shared.svelte';
	import { formatCurrency } from '$lib/formatters';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Check, X, Pencil, Trash } from 'lucide-svelte';
	import { EditSavingsGoalDialog } from '$lib/components/ui/edit-savings-goal-dialog/index.js';

	let { savingsGoalAllocation, showActions = false } = $props();

	// Edit state
	let editOpen = $state(false);
	let confirmDelete = $state(false);
	let editName = $state('');
	let editAmount = $state(0);
	let editAccount = $state('');

	const accounts = $derived(budget.current['Accounts']);
	//remove special characters, lowercase (slugify)
	const goalNameId = $derived(
		`goal-title-${savingsGoalAllocation['Name']
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')}`
	);
	const balance = $derived(
		accounts.find((acc) => acc['Name'] === savingsGoalAllocation['Account'])?.['Balance'] ?? 0
	);
	const progress = $derived.by(() => {
		const total = savingsGoalAllocation['Amount'];
		if (!total) return 0;
		return Math.min(100, Math.round((balance / total) * 100));
	});

	const formattedBalance = $derived(formatCurrency(balance));
	const formattedTotal = $derived(formatCurrency(savingsGoalAllocation['Amount']));
	const isComplete = $derived(progress >= 100);

	// Radial chart math
	const radius = 40;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = $derived(circumference - (progress / 100) * circumference);

	function openEditDialog() {
		editName = savingsGoalAllocation['Name'];
		editAmount = savingsGoalAllocation['Amount'];
		editAccount = savingsGoalAllocation['Account'];
		editOpen = true;
	}

	function deleteGoal() {
		if (!confirmDelete) {
			confirmDelete = true;
			return;
		}
		budget.current = {
			...budget.current,
			Allocations: budget.current.Allocations.filter((g) => g.Name !== savingsGoalAllocation.Name)
		};
	}
</script>

<Card.Root class="overflow-hidden">
	<Card.Header>
		<Card.Title id={goalNameId} class="text-center">{savingsGoalAllocation['Name']}</Card.Title>
	</Card.Header>

	<Card.Content class="flex flex-col items-center gap-1 pb-0">
		<progress
			class="sr-only"
			value={progress}
			max="100"
			aria-labelledby={goalNameId}
			aria-valuetext={`${formattedBalance} saved of ${formattedTotal} (${progress}% complete)`}
		>
			{progress}%
		</progress>
		<!-- Radial chart -->
		<div class="relative w-32 h-32">
			<svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" aria-hidden="true">
				<circle
					cx="50"
					cy="50"
					r={radius}
					fill="none"
					stroke="currentColor"
					stroke-width="10"
					class="text-muted"
				/>
				<circle
					cx="50"
					cy="50"
					r={radius}
					fill="none"
					stroke="currentColor"
					stroke-width="10"
					stroke-linecap="round"
					stroke-dasharray={circumference}
					stroke-dashoffset={strokeDashoffset}
					class={isComplete ? 'text-primary animate-pulse-slow' : 'text-primary'}
					style="transition: stroke-dashoffset 0.5s ease"
				/>
			</svg>
			<div class="absolute inset-0 flex items-center justify-center">
				<span class="text-lg font-semibold">{progress}%</span>
			</div>
		</div>

		<p class="text-sm text-muted-foreground">
			{formattedBalance} <span class="text-foreground font-medium">/</span>
			{formattedTotal}
		</p>
	</Card.Content>

	<Card.Footer class="gap-2 pt-2">
		{#if showActions}
			<!-- Edit -->
			{#if confirmDelete}
				<Button
					variant="ghost"
					aria-label="Cancel deletion"
					onclick={() => (confirmDelete = false)}
				>
					<X />
				</Button>
			{:else}
				<Button variant="ghost" onclick={openEditDialog} aria-label="Edit savings goal allocation">
					<Pencil aria-hidden="true" />
				</Button>
				<EditSavingsGoalDialog bind:open={editOpen} {savingsGoalAllocation}/>
			{/if}

			<Separator orientation="vertical" class="h-6" />

			<!-- Delete -->
			<Button
				variant="ghost"
				aria-label={confirmDelete ? 'Confirm deletion' : 'Delete goal'}
				onclick={deleteGoal}
			>
				{#if confirmDelete}
					<Check />
				{:else}
					<Trash />
				{/if}
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>
