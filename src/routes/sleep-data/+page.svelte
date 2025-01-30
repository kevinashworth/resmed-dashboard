<script lang="ts">
	import { Axis, Bars, Chart, Highlight, Rule, Svg, Text, Tooltip } from 'layerchart';
	import { format, PeriodType } from '@layerstack/utils';
	import { cubicInOut } from 'svelte/easing';

	import { scaleBand, scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
	import { mean, sum } from 'd3-array';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Date range control
	let selectedPreset = $state('last60');
	let startDate = $state('');
	let endDate = $state('');

	// Chart visibility states
	let leakPercentileVisible = $state(true);
	let leakScoreVisible = $state(false);
	let maskPairCountVisible = $state(true);
	let maskScoreVisible = $state(false);
	let sleepScoreVisible = $state(true);
	let totalUsageVisible = $state(true);
	let usageScoreVisible = $state(false);

	// Initialize and update dates based on preset
	$effect(() => {
		const now = new Date();
		if (selectedPreset === 'last30') {
			const thirtyDaysAgo = new Date(now);
			thirtyDaysAgo.setDate(now.getDate() - 30);
			startDate = thirtyDaysAgo.toISOString().split('T')[0];
			endDate = now.toISOString().split('T')[0];
		} else if (selectedPreset === 'last60') {
			const sixtyDaysAgo = new Date(now);
			sixtyDaysAgo.setDate(now.getDate() - 60);
			startDate = sixtyDaysAgo.toISOString().split('T')[0];
			endDate = now.toISOString().split('T')[0];
		} else if (selectedPreset === 'last90') {
			const ninetyDaysAgo = new Date(now);
			ninetyDaysAgo.setDate(now.getDate() - 90);
			startDate = ninetyDaysAgo.toISOString().split('T')[0];
			endDate = now.toISOString().split('T')[0];
		} else if (selectedPreset === 'lastMonth') {
			const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
			startDate = firstDayLastMonth.toISOString().split('T')[0];
			endDate = lastDayLastMonth.toISOString().split('T')[0];
		} else if (selectedPreset === 'allTime') {
			const julyFirst2024 = new Date(2024, 6, 1);
			startDate = julyFirst2024.toISOString().split('T')[0];
			endDate = now.toISOString().split('T')[0];
		}
	});

	// Filter data based on selected date range
	const dateFilter = (d: { date: string | number | Date }): boolean => {
		const date = new Date(d.date);
		return date >= new Date(startDate) && date <= new Date(endDate);
	};
	const filteredData = $derived({
		leakPercentileData: data.leakPercentileData.filter(dateFilter),
		leakScoreData: data.leakScoreData.filter(dateFilter),
		maskPairCountData: data.maskPairCountData.filter(dateFilter),
		maskScoreData: data.maskScoreData.filter(dateFilter),
		sleepScoreData: data.sleepScoreData.filter(dateFilter),
		totalUsageData: data.totalUsageData.filter(dateFilter),
		usageScoreData: data.usageScoreData.filter(dateFilter)
	});

	function handleCustomDateChange() {
		selectedPreset = 'custom';
	}
</script>

<div class="p-4">
	<!-- Date Range Controls -->
	<div class="mb-6 inline-block rounded bg-gray-50 p-4">
		<h1 class="mb-4 text-xl font-bold">Sleep Data Analysis</h1>
		<div class="flex flex-col items-start gap-4">
			<dvi class="flex items-center gap-3">
				<label for="preset-range" class="text-sm font-semibold text-gray-800">Date Range</label>
				<select
					id="preset-range"
					class="rounded border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
					bind:value={selectedPreset}
				>
					<option value="last30">Last 30 Days</option>
					<option value="last60">Last 60 Days</option>
					<option value="last90">Last 90 Days</option>
					<option value="lastMonth">Last Calendar Month</option>
					<option value="allTime">All Time</option>
					<option value="custom">Custom Range</option>
				</select>
			</dvi>
			<div class="w-full text-center text-xs text-gray-500">~ or ~</div>
			<div class="flex items-center gap-3">
				<label for="start-date" class="text-sm font-semibold text-gray-800">Start Date</label>
				<input
					type="date"
					id="start-date"
					class="rounded border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
					bind:value={startDate}
					onchange={handleCustomDateChange}
				/>
			</div>
			<div class="flex items-center gap-3">
				<label for="end-date" class="text-sm font-semibold text-gray-800">End Date</label>
				<input
					type="date"
					id="end-date"
					class="rounded border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
					bind:value={endDate}
					onchange={handleCustomDateChange}
				/>
			</div>
		</div>
	</div>

	{#if data.sleepData.length > 0}
		<div class="mx-auto flex flex-col gap-4">
			<!-- MYAIR SCORE Chart // sleepScore is MYAIR SCORE -->
			<div class="rounded border p-4">
				<div class="mb-2 flex items-center justify-start">
					<h2 class="text-score text-lg font-semibold uppercase">myAir Score</h2>
					<button
						class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
						onclick={() => (sleepScoreVisible = !sleepScoreVisible)}
					>
						{sleepScoreVisible ? '▼ Collapse' : '▶ Expand'}
					</button>
				</div>
				{#if sleepScoreVisible}
					<div class="h-[300px]">
						<Chart
							data={filteredData.sleepScoreData}
							x="date"
							xScale={scaleBand().padding(0.4)}
							y="value"
							yDomain={[0, null]}
							padding={{ left: 16, bottom: 24 }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => {
										const date = new Date(d);
										return date.getDay() === 0
											? format(d, PeriodType.Day, { variant: 'short' })
											: '';
									}}
									rule
								/>
								<Bars radius={4} rounded="top" class="fill-score" />
							</Svg>
						</Chart>
					</div>
				{/if}
			</div>

			<!-- USAGE HOURS Chart // totalUsage is USAGE HOURS -->
			<div class="rounded border p-4">
				<div class="mb-2 flex items-center justify-start">
					<h2 class="text-hours text-lg font-semibold uppercase">Usage Hours</h2>
					<button
						class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
						onclick={() => (totalUsageVisible = !totalUsageVisible)}
					>
						{totalUsageVisible ? '▼ Collapse' : '▶ Expand'}
					</button>
				</div>
				{#if totalUsageVisible}
					<div class="h-[300px]">
						<Chart
							data={filteredData.totalUsageData}
							x="date"
							xScale={scaleBand().padding(0.4)}
							y="value"
							yDomain={[0, 600]}
							yScale={scaleTime()}
							padding={{ left: 16, bottom: 24 }}
							tooltip={{ mode: 'band' }}
							let:width
							let:yScale
						>
							{@const avg = mean(filteredData.totalUsageData, (d) => d.value)}
							<Svg>
								<Axis
									placement="left"
									format={(d) => `${Math.floor(d / 60)}h ${d % 60}m`}
									grid
									rule
								/>
								<Axis
									placement="bottom"
									format={(d) => {
										const date = new Date(d);
										return date.getDay() === 0
											? format(d, PeriodType.Day, { variant: 'short' })
											: '';
									}}
									rule
								/>
								<Bars radius={4} rounded="top" class="fill-hours" />
								<Rule y={avg} class="stroke-hours stroke-1 [stroke-dasharray:3]" />
								<Text
									x={width}
									y={yScale(avg)}
									dy={-4}
									value="Average"
									textAnchor="end"
									verticalAnchor="end"
									class="text-sm"
								/>
							</Svg>
							<Tooltip.Root
								x="data"
								y="data"
								yOffset={2}
								anchor="bottom"
								contained={false}
								class="text-primary border-primary rounded border bg-gray-100 px-2 py-[2px] text-[10px] font-semibold whitespace-nowrap"
								let:data
							>
								{`${Math.floor(data.value / 60)}h ${data.value % 60}m`}
							</Tooltip.Root>
						</Chart>
					</div>
				{/if}
			</div>

			<!-- Usage Score Chart -->
			<div class="rounded border p-4">
				<div class="mb-2 flex items-center justify-start">
					<h2 class="text-lg font-semibold">Usage Score</h2>
					<button
						class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
						onclick={() => (usageScoreVisible = !usageScoreVisible)}
					>
						{usageScoreVisible ? '▼ Collapse' : '▶ Expand'}
					</button>
				</div>
				{#if usageScoreVisible}
					<div class="h-[300px]">
						<Chart
							data={filteredData.usageScoreData}
							x="date"
							xScale={scaleBand().padding(0.4)}
							y="value"
							yDomain={[0, null]}
							padding={{ left: 16, bottom: 24 }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => {
										const date = new Date(d);
										return date.getDay() === 0
											? format(d, PeriodType.Day, { variant: 'short' })
											: '';
									}}
									rule
								/>
								<Bars radius={4} rounded="top" class="fill-green-500" />
							</Svg>
						</Chart>
					</div>
				{/if}
			</div>

			<!-- Mask Score Chart -->
			<div class="rounded border p-4">
				<div class="mb-2 flex items-center justify-start">
					<h2 class="text-lg font-semibold">Mask Score</h2>
					<button
						class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
						onclick={() => (maskScoreVisible = !maskScoreVisible)}
					>
						{maskScoreVisible ? '▼ Collapse' : '▶ Expand'}
					</button>
				</div>
				{#if maskScoreVisible}
					<div class="h-[300px]">
						<Chart
							data={filteredData.maskScoreData}
							x="date"
							xScale={scaleBand().padding(0.4)}
							y="value"
							yDomain={[0, null]}
							padding={{ left: 16, bottom: 24 }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => {
										const date = new Date(d);
										return date.getDay() === 0
											? format(d, PeriodType.Day, { variant: 'short' })
											: '';
									}}
									rule
								/>
								<Bars radius={4} rounded="top" class="fill-yellow-500" />
							</Svg>
						</Chart>
					</div>
				{/if}
			</div>

			<!-- MASK ON/OFF Chart // maskPairCount is MASK ON/OFF -->
			<div class="rounded border p-4">
				<div class="mb-2 flex items-center justify-start">
					<h2 class="text-mask text-lg font-semibold uppercase">Mask On/Off</h2>
					<button
						class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
						onclick={() => (maskPairCountVisible = !maskPairCountVisible)}
					>
						{maskPairCountVisible ? '▼ Collapse' : '▶ Expand'}
					</button>
				</div>
				{#if maskPairCountVisible}
					<div class="h-[300px]">
						<Chart
							data={filteredData.maskPairCountData}
							x="date"
							xScale={scaleBand().padding(0.4)}
							y="value"
							yDomain={[0, null]}
							padding={{ left: 16, bottom: 24 }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => {
										const date = new Date(d);
										return date.getDay() === 0
											? format(d, PeriodType.Day, { variant: 'short' })
											: '';
									}}
									rule
								/>
								<Bars
									tweened={{
										duration: 500,
										easing: cubicInOut
									}}
									radius={4}
									rounded="top"
									class="fill-mask"
								/>
							</Svg>
						</Chart>
					</div>
				{/if}
			</div>

			<!-- Leak Score Chart -->
			<div class="rounded border p-4">
				<div class="mb-2 flex items-center justify-start">
					<h2 class="text-lg font-semibold">Leak Score</h2>
					<button
						class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
						onclick={() => (leakScoreVisible = !leakScoreVisible)}
					>
						{leakScoreVisible ? '▼ Collapse' : '▶ Expand'}
					</button>
				</div>
				{#if leakScoreVisible}
					<div class="h-[300px]">
						<Chart
							data={filteredData.leakScoreData}
							x="date"
							xScale={scaleBand().padding(0.4)}
							y="value"
							yDomain={[0, null]}
							padding={{ left: 16, bottom: 24 }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => {
										const date = new Date(d);
										return date.getDay() === 0
											? format(d, PeriodType.Day, { variant: 'short' })
											: '';
									}}
									rule
								/>
								<Bars radius={4} rounded="top" class="fill-red-500" />
							</Svg>
						</Chart>
					</div>
				{/if}
			</div>

			<!-- MASK SEAL Chart // leakPercentile is MASK SEAL // -->
			<div class="rounded border p-4">
				<div class="mb-2 flex items-center justify-start">
					<h2 class="text-seal text-lg font-semibold uppercase">Mask Seal</h2>
					<button
						class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
						onclick={() => (leakPercentileVisible = !leakPercentileVisible)}
					>
						{leakPercentileVisible ? '▼ Collapse' : '▶ Expand'}
					</button>
				</div>
				{#if leakPercentileVisible}
					<div class="h-[300px]">
						<Chart
							data={filteredData.leakPercentileData}
							x="date"
							xScale={scaleBand().padding(0.4)}
							y="value"
							yDomain={[0, null]}
							padding={{ left: 16, bottom: 24 }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => {
										const date = new Date(d);
										return date.getDay() === 0
											? format(d, PeriodType.Day, { variant: 'short' })
											: '';
									}}
									rule
								/>
								<Bars radius={4} rounded="top" class="fill-seal" />
							</Svg>
						</Chart>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<p>No sleep data available.</p>
	{/if}
</div>
