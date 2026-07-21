<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';

	import { CalendarIcon } from '@lucide/svelte';

	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	import { budget } from '$lib/shared.svelte';

	import type { FundingSource, FundingType, PayTimingPeriod } from '$lib/schemas/budget';

	let {
		open = $bindable()
	}: {
		open: boolean;
	} = $props();

	let fundingSources = $derived(budget.current['Funding Sources']);

	// Fixed for this dialog — student jobs are paid hourly.
	const fundingType: FundingType = 'Hourly'; // or 'Salary' in the salaried dialog

	let name = $state('');
	let rate = $state(0);

	let period = $state<PayTimingPeriod>('Biweekly');
	let hoursPerPayPeriod = $state(20);

	// Student jobs are term-based: default to "hasn't started yet" and
	// "the end date is already known" since that's the common case.
	let currentlyEmployed = $state(false);
	let knowsEndDate = $state(true);

	let startDate = $state<string | null>(null);
	let firstPayDate = $state<string | null>(null);
	let endDate = $state<string | null>(null);

	let startCalendarOpen = $state(false);
	let firstPayCalendarOpen = $state(false);
	let endCalendarOpen = $state(false);

	let startCalendarValue = $state<CalendarDate | undefined>();
	let firstPayCalendarValue = $state<CalendarDate | undefined>();
	let endCalendarValue = $state<CalendarDate | undefined>();

	function formatDate(date: CalendarDate) {
		return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
	}

	$effect(() => {
		if (open) {
			name = '';
			rate = 0;

			period = 'Biweekly';
			hoursPerPayPeriod = 20;

			currentlyEmployed = false;
			knowsEndDate = true;

			startDate = null;
			firstPayDate = null;
			endDate = null;

			startCalendarValue = undefined;
			firstPayCalendarValue = undefined;
			endCalendarValue = undefined;
		}
	});

	$effect(() => {
		if (currentlyEmployed) {
			startDate = null;
			startCalendarValue = undefined;
		}
	});

	$effect(() => {
		if (!knowsEndDate) {
			endDate = null;
			endCalendarValue = undefined;
		}
	});

	function addFundingSource() {
		if (!name.trim()) {
			alert('Name is required');
			return;
		}

		if (fundingSources.some((source) => source.Name.toLowerCase() === name.trim().toLowerCase())) {
			alert('A funding source with that name already exists.');
			return;
		}

		if (Number(rate) <= 0) {
			alert('Rate must be greater than 0.');
			return;
		}

		if (!currentlyEmployed && !startDate) {
			alert('Start date is required.');
			return;
		}

		if (!firstPayDate) {
			alert(currentlyEmployed ? 'Next pay date is required.' : 'First pay date is required.');
			return;
		}

		if (knowsEndDate && !endDate) {
			alert('End date is required.');
			return;
		}

		const newSource: FundingSource = {
			Name: name.trim(),
			'Funding Type': fundingType,
			Rate: Number(rate),
			'Pay Timing': {
				'Start Date': startDate,
				'First Pay Date': firstPayDate,
				Period: period,
				'End Date': endDate
			},
			'Hours Per Pay Period': hoursPerPayPeriod // null in the salaried dialog
		};

		budget.current = {
			...budget.current,
			'Funding Sources': [...fundingSources, newSource]
		};

		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Add Student Job</Dialog.Title>
			<Dialog.Description>Add a new term-based student job to your budget.</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="funding-source-name-input">Name</Label>
				<Input id="funding-source-name-input" bind:value={name} />
			</div>

			<div class="grid gap-2">
				<Label for="pay-rate-input">Hourly Rate</Label>
				<Input id="pay-rate-input" type="number" bind:value={rate} />
			</div>

			<div class="grid gap-2">
				<Label for="hours-per-pay-period-input">Hours Per Pay Period</Label>
				<Input id="hours-per-pay-period-input" type="number" bind:value={hoursPerPayPeriod} />
			</div>

			<div class="grid gap-2">
				<Label>Pay Period</Label>

				<Select.Root type="single" bind:value={period}>
					<Select.Trigger class="w-full">
						{period}
					</Select.Trigger>

					<Select.Content>
						<Select.Item value="Weekly">Weekly</Select.Item>
						<Select.Item value="Biweekly">Biweekly</Select.Item>
						<Select.Item value="Monthly">Monthly</Select.Item>
						<Select.Item value="Yearly">Yearly</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex items-center gap-2">
				<Switch id="currently-employed-switch" bind:checked={currentlyEmployed} />
				<Label for="currently-employed-switch" class="font-normal">
					I've already started this job
				</Label>
			</div>

			{#if !currentlyEmployed}
				<div class="grid gap-2">
					<Label>Term Start Date</Label>

					<Popover.Root bind:open={startCalendarOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" class="w-full justify-between font-normal">
									{#if startDate}
										{new Date(`${startDate}T00:00:00`).toLocaleDateString()}
									{:else}
										Select date
									{/if}

									<CalendarIcon class="size-4" />
								</Button>
							{/snippet}
						</Popover.Trigger>

						<Popover.Content class="w-auto overflow-hidden p-0" align="start">
							<Calendar
								type="single"
								bind:value={startCalendarValue}
								captionLayout="dropdown"
								minValue={today(getLocalTimeZone()).subtract({ years: 5 })}
								maxValue={today(getLocalTimeZone()).add({ years: 5 })}
								onValueChange={(v) => {
									if (v) {
										startDate = formatDate(v);
									}

									startCalendarOpen = false;
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
			{/if}

			<div class="grid gap-2">
				<Label>
					{currentlyEmployed ? 'Next Pay Date' : 'First Pay Date'}
				</Label>

				<Popover.Root bind:open={firstPayCalendarOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="w-full justify-between font-normal">
								{#if firstPayDate}
									{new Date(`${firstPayDate}T00:00:00`).toLocaleDateString()}
								{:else}
									Select date
								{/if}

								<CalendarIcon class="size-4" />
							</Button>
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="w-auto overflow-hidden p-0" align="start">
						<Calendar
							type="single"
							bind:value={firstPayCalendarValue}
							captionLayout="dropdown"
							minValue={today(getLocalTimeZone()).subtract({ years: 5 })}
							maxValue={today(getLocalTimeZone()).add({ years: 5 })}
							onValueChange={(v) => {
								if (v) {
									firstPayDate = formatDate(v);
								}

								firstPayCalendarOpen = false;
							}}
						/>
					</Popover.Content>
				</Popover.Root>
			</div>

			<div class="flex items-center gap-2">
				<Switch id="knows-end-date-switch" bind:checked={knowsEndDate} />
				<Label for="knows-end-date-switch" class="font-normal">I know when the term ends</Label>
			</div>

			{#if knowsEndDate}
				<div class="grid gap-2">
					<Label>Term End Date</Label>

					<Popover.Root bind:open={endCalendarOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" class="w-full justify-between font-normal">
									{#if endDate}
										{new Date(`${endDate}T00:00:00`).toLocaleDateString()}
									{:else}
										Select date
									{/if}

									<CalendarIcon class="size-4" />
								</Button>
							{/snippet}
						</Popover.Trigger>

						<Popover.Content class="w-auto overflow-hidden p-0" align="start">
							<Calendar
								type="single"
								bind:value={endCalendarValue}
								captionLayout="dropdown"
								minValue={today(getLocalTimeZone()).subtract({ years: 5 })}
								maxValue={today(getLocalTimeZone()).add({ years: 20 })}
								onValueChange={(v) => {
									if (v) {
										endDate = formatDate(v);
									}

									endCalendarOpen = false;
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="outline">Cancel</Button>
			</Dialog.Close>

			<Button onclick={addFundingSource}>Add Job</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
