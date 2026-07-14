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

	let { goal, showActions = false } = $props();

	// Edit state
	let editOpen = $state(false);
	let confirmDelete = $state(false);
	let editName = $state('');
	let editAmount = $state(0);
	let editAccount = $state('');

	const accounts = $derived(budget.current['Accounts']);
	//remove special characters, lowercase (slugify)
	const goalNameId = $derived(
		`goal-title-${goal['Name']
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')}`
	);
	const balance = $derived(
		accounts.find((acc) => acc['Name'] === goal['Account'])?.['Balance'] ?? 0
	);
	const progress = $derived.by(() => {
		const total = goal['Amount'];
		if (!total) return 0;
		return Math.min(100, Math.round((balance / total) * 100));
	});

	const formattedBalance = $derived(formatCurrency(balance));
	const formattedTotal = $derived(formatCurrency(goal['Amount']));
	const isComplete = $derived(progress >= 100);

	// Radial chart math
	const radius = 40;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = $derived(circumference - (progress / 100) * circumference);

	function openEditDialog() {
		editName = goal['Name'];
		editAmount = goal['Amount'];
		editAccount = goal['Account'];
		editOpen = true;
	}

	function saveGoal() {
		budget.current = {
			...budget.current,
			Allocations: budget.current['Allocations'].map((g) =>
				g['Name'] === goal['Name']
					? { ...g, Name: editName, Amount: Number(editAmount), Account: editAccount }
					: g
			)
		};
		editOpen = false;
	}

	function deleteGoal() {
		if (!confirmDelete) {
			confirmDelete = true;
			return;
		}
		budget.current = {
			...budget.current,
			Allocations: budget.current['Allocations'].filter((g) => g['Name'] !== goal['Name'])
		};
	}
</script>

<Card.Root class="overflow-hidden">
	<Card.Header>
		<Card.Title id={goalNameId} class="text-center">{goal['Name']}</Card.Title>
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
				<Dialog.Root bind:open={editOpen}>
					<Dialog.Trigger
						class={buttonVariants({ variant: 'ghost' })}
						aria-label="Edit goal"
						onclick={openEditDialog}
					>
						<Pencil />
					</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Edit Goal</Dialog.Title>
							<Dialog.Description>Update your savings goal details.</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-4 py-4">
							<div class="grid gap-2">
								<Label for="goal-name">Name (Cannot be changed)</Label>
								<Input id="goal-name" readonly bind:value={editName} />
							</div>
							<div class="grid gap-2">
								<Label for="goal-amount">Target Amount</Label>
								<Input id="goal-amount" type="number" bind:value={editAmount} />
							</div>
							<div class="grid gap-2">
								<Label for="goal-account">Linked Account</Label>
								<Select.Root type="single" bind:value={editAccount}>
									<Select.Trigger class="w-full">
										{editAccount || 'Select an account'}
									</Select.Trigger>
									<Select.Content>
										{#each accounts as acc}
											<Select.Item value={acc['Name']}>{acc['Name']}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>
						</div>
						<Dialog.Footer>
							<Dialog.Close>
								<Button variant="outline">Cancel</Button>
							</Dialog.Close>
							<Button onclick={saveGoal}>Save</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
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
