<script lang="ts">
  import { Axis, Bars, Chart, Rule, Svg, Text, Tooltip } from "layerchart";
  import { format, PeriodType } from "@layerstack/utils";
  import { scaleBand } from "d3-scale";
  import { max, mean } from "d3-array";
  import { Tabs, TabItem } from "flowbite-svelte";

  import type { PageProps } from "./$types";

  import TabItemTitle from "./tab-item-title.svelte";

  let { data }: PageProps = $props();

  // Date range control
  let selectedPreset = $state("");
  let startDate = $state("");
  let endDate = $state("");

  // Initialize and update dates based on preset
  $effect(() => {
    if (startDate === "" && endDate === "" && selectedPreset === "") {
      // console.log("setting default date range");
      selectedPreset = "last60";
      const sixtyDaysAgo = new Date(data.newestDate);
      sixtyDaysAgo.setDate(data.newestDate.getDate() - 60);
      startDate = sixtyDaysAgo.toISOString().split("T")[0];
      endDate = data.newestDate.toISOString().split("T")[0];
    }
  });

  // Filter data based on selected date range
  const dateFilter = (d: { date: string | number | Date }): boolean => {
    const date = new Date(d.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  };
  const filteredData = $derived({
    eventsData: data.eventsData.filter(dateFilter),
    leakPercentileData: data.leakPercentileData.filter(dateFilter),
    maskPairCountData: data.maskPairCountData.filter(dateFilter),
    sleepScoreData: data.sleepScoreData.filter(dateFilter),
    totalUsageData: data.totalUsageData.filter(dateFilter),
  });

  function handlePresetChange() {
    // console.log("hello from handlePresetChange");
    startDate = data.oldestDate.toISOString().split("T")[0];
    endDate = data.newestDate.toISOString().split("T")[0];
    if (selectedPreset === "last30") {
      const thirtyDaysAgo = new Date(data.newestDate);
      thirtyDaysAgo.setDate(data.newestDate.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split("T")[0];
    } else if (selectedPreset === "last60") {
      const sixtyDaysAgo = new Date(data.newestDate);
      sixtyDaysAgo.setDate(data.newestDate.getDate() - 60);
      startDate = sixtyDaysAgo.toISOString().split("T")[0];
    } else if (selectedPreset === "last90") {
      const ninetyDaysAgo = new Date(data.newestDate);
      ninetyDaysAgo.setDate(data.newestDate.getDate() - 90);
      startDate = ninetyDaysAgo.toISOString().split("T")[0];
    } else if (selectedPreset === "last180") {
      const oneEightyDaysAgo = new Date(data.newestDate);
      oneEightyDaysAgo.setDate(data.newestDate.getDate() - 180);
      startDate = oneEightyDaysAgo.toISOString().split("T")[0];
    } else if (selectedPreset === "lastMonth") {
      const firstDayLastMonth = new Date(data.newestDate.getFullYear(), data.newestDate.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(data.newestDate.getFullYear(), data.newestDate.getMonth(), 0);
      startDate = firstDayLastMonth.toISOString().split("T")[0];
      endDate = lastDayLastMonth.toISOString().split("T")[0];
    } else if (selectedPreset === "allTime") {
    }
  }

  function handleCustomDateChange() {
    selectedPreset = "custom";
    // startDate = data.oldestDate.toISOString().split("T")[0];
    // endDate = data.newestDate.toISOString().split("T")[0];
  }
</script>

<div class="p-4">
  <!-- Date Range Controls -->
  <div class="mb-6 inline-block rounded bg-gray-50 p-4">
    <h1 class="mb-4 text-xl font-bold">Sleep Data Analysis</h1>
    <div class="flex flex-row items-start gap-4">
      <dvi class="flex items-center gap-3">
        <label for="preset-range" class="text-sm font-semibold text-gray-800">Date Range</label>
        <select
          id="preset-range"
          class="rounded border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          bind:value={selectedPreset}
          onchange={handlePresetChange}
        >
          <option value="last30">Last 30 Days</option>
          <option value="last60">Last 60 Days</option>
          <option value="last90">Last 90 Days</option>
          <option value="last180">Last 180 Days</option>
          <option value="lastMonth">Last Calendar Month</option>
          <option value="allTime">All Time</option>
          <option value="custom">Custom Range</option>
        </select>
      </dvi>
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

  {#if data.loadingError}
    <div>No sleep data available.</div>
  {:else}
    <div class="flex flex-col">
      <Tabs class="flex-nowrap" contentClass="p-4 bg-gray-50 rounded-lg">
        <TabItem open class="me-8 w-32">
          <TabItemTitle slot="title" name="hours" title="Usage Hours" />

          <!-- 1. USAGE HOURS Chart // totalUsage is USAGE HOURS -->
          <div class="m-4 rounded">
            <div class="h-[500px]">
              <Chart
                data={filteredData.totalUsageData}
                x="date"
                xScale={scaleBand().padding(0.4)}
                y="value"
                yDomain={[0, 600]}
                padding={{ left: 32, bottom: 24 }}
                tooltip={{ mode: "band" }}
                let:width
                let:yScale
              >
                {@const avg = mean(filteredData.totalUsageData, (d) => d.value)}
                <Svg>
                  <Axis
                    placement="left"
                    format={(d) => `${Math.floor(d / 60)}`}
                    grid
                    rule
                    label="Hours"
                    classes={{
                      label: "m-8 font-semibold text-base",
                    }}
                    ticks={[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600]}
                  />
                  <Axis
                    placement="bottom"
                    format={(d) => {
                      const date = new Date(d);
                      const dayNumber = format(d, PeriodType.Day, { variant: "short" });
                      const dayLetter = format(d, PeriodType.Custom, { custom: "eeeee" });
                      return date.getDay() === 0 ? dayNumber : "";
                    }}
                    rule
                  />
                  <Bars radius={2} rounded="top" class="fill-hours/70" />
                  <Rule y={avg} class="stroke-hours/60 stroke-1 [stroke-dasharray:3]" />
                  <Text
                    x={width}
                    y={yScale(avg)}
                    dy={-4}
                    value="Average"
                    textAnchor="end"
                    verticalAnchor="end"
                    class="text-hours text-sm"
                  />
                </Svg>
                <Tooltip.Root
                  variant="none"
                  x="data"
                  y="data"
                  yOffset={2}
                  anchor="bottom"
                  motion={false}
                  contained={false}
                  class="rounded-xl border border-gray-400 bg-white p-2 whitespace-nowrap drop-shadow-lg"
                  let:data
                >
                  <Tooltip.Item
                    classes={{
                      label: "text-[8px] text-gray-500",
                      value: "font-bold text-sm text-black",
                    }}
                    value={`${Math.floor(data.value / 60)}hrs ${data.value % 60}mins`}
                    valueAlign="center"
                    label={`${format(data.date, PeriodType.Custom, { custom: "eeee, MMMM d" })}`}
                  />
                </Tooltip.Root>
              </Chart>
            </div>
          </div>
        </TabItem>
        <TabItem class="mx-8 w-32">
          <TabItemTitle slot="title" name="leak" title="Mask Seal" />

          <!-- 2. MASK SEAL Chart // leakPercentile is MASK SEAL // -->
          <div class="m-4 rounded">
            <div class="h-[500px]">
              <Chart
                data={filteredData.leakPercentileData}
                x="date"
                xScale={scaleBand().padding(0.4)}
                y="value"
                yDomain={[0, null]}
                padding={{ left: 32, bottom: 24 }}
                tooltip={{ mode: "band" }}
                let:width
                let:yScale
              >
                {@const avg = mean(filteredData.leakPercentileData, (d) => d.value)}
                {@const maxx = max(filteredData.leakPercentileData, (d) => d.value) ?? 10}
                <Svg>
                  <Rule y={avg} class="stroke-seal/60 stroke-1 [stroke-dasharray:3]" title="qwer" />
                  <Text
                    x={width}
                    y={yScale(avg)}
                    dy={-4}
                    value={`Average ${avg?.toFixed(1)} L/min`}
                    textAnchor="end"
                    verticalAnchor="end"
                    class="fill-seal text-sm"
                  />
                  <Rule y={24} class="stroke-gray-400 stroke-1" />
                  <Text
                    x={width}
                    y={yScale(24)}
                    dy={-4}
                    value="Threshold 24 L/min"
                    textAnchor="end"
                    verticalAnchor="end"
                    class="fill-gray-600 text-sm"
                  />
                  <Axis
                    placement="left"
                    grid
                    rule
                    label="Leak (L/min)"
                    classes={{
                      label: "m-8 font-semibold text-base",
                    }}
                    ticks={[...Array(Math.ceil(maxx / 10)).keys()].map((x) => x * 10)}
                  />
                  <Axis
                    placement="bottom"
                    format={(d) => {
                      const date = new Date(d);
                      return date.getDay() === 0 ? format(d, PeriodType.Day, { variant: "short" }) : "";
                    }}
                    rule
                  />
                  <Bars radius={4} rounded="top" class="fill-seal/70" />
                </Svg>
                <Tooltip.Root
                  variant="none"
                  x="data"
                  y="data"
                  yOffset={4}
                  anchor="bottom"
                  motion={false}
                  contained={false}
                  class="rounded-xl border border-gray-400 bg-white p-2 whitespace-nowrap drop-shadow-lg"
                  let:data
                >
                  <Tooltip.Item
                    classes={{
                      root: "flex flex-col justify-center items-center gap-1",
                      label: "text-2xs text-black mx-auto tracking-tighter font-extralight",
                      value: "font-bold text-sm text-black",
                    }}
                    value={`${data.value} L/min`}
                    valueAlign="center"
                    label={`${format(data.date, PeriodType.Custom, { custom: "eeee, MMMM d" })}`}
                  />
                </Tooltip.Root>
              </Chart>
            </div>
          </div>
        </TabItem>

        <!-- EVENTS -->
        <TabItem class="mx-8 w-32">
          <TabItemTitle slot="title" name="events" title="Events" />

          <!-- 3. EVENTS Chart // events is EVENTS //   -->
          <div class="m-4 rounded">
            <div class="h-[500px]">
              <Chart
                data={filteredData.eventsData}
                x="date"
                xScale={scaleBand().padding(0.4)}
                y="value"
                yDomain={[0, null]}
                padding={{ left: 32, bottom: 24 }}
                tooltip={{ mode: "band" }}
              >
                <Svg>
                  <Axis
                    placement="left"
                    grid
                    rule
                    label="Events"
                    classes={{
                      label: "m-8 font-semibold text-base",
                    }}
                  />
                  <Axis
                    placement="bottom"
                    format={(d) => {
                      const date = new Date(d);
                      return date.getDay() === 0 ? format(d, PeriodType.Day, { variant: "short" }) : "";
                    }}
                    rule
                  />
                  <Bars radius={4} rounded="top" class="fill-events/70" />
                </Svg>
                <Tooltip.Root
                  variant="none"
                  x="data"
                  y="data"
                  yOffset={4}
                  anchor="bottom"
                  motion={false}
                  contained={false}
                  class="rounded-xl border border-gray-400 bg-white p-2 whitespace-nowrap drop-shadow-lg"
                  let:data
                >
                  <Tooltip.Item
                    classes={{
                      root: "flex flex-col justify-center items-center gap-2",
                      label: "text-2xs text-black mx-auto tracking-tighter font-extralight",
                      value: "font-bold text-sm text-black",
                    }}
                    value={`${data.value} events/hour`}
                    label={`${format(data.date, PeriodType.Custom, { custom: "eeee, MMMM d" })}`}
                  />
                </Tooltip.Root>
              </Chart>
            </div>
          </div>
        </TabItem>

        <!-- MASK ON/OFF -->
        <TabItem class="mx-8 w-32">
          <TabItemTitle slot="title" name="mask" title="Mask On/Off" />

          <!-- 4. MASK ON/OFF Chart // maskPairCount is MASK ON/OFF -->
          <div class="m-4 rounded">
            <div class="h-[500px]">
              <Chart
                data={filteredData.maskPairCountData}
                x="date"
                xScale={scaleBand().padding(0.4)}
                y="value"
                yDomain={[0, null]}
                padding={{ left: 32, bottom: 24 }}
                tooltip={{ mode: "band" }}
              >
                <Svg>
                  <Axis
                    placement="left"
                    grid
                    rule
                    label="On/off"
                    classes={{
                      label: "m-8 font-semibold text-base",
                    }}
                  />
                  <Axis
                    placement="bottom"
                    format={(d) => {
                      const date = new Date(d);
                      return date.getDay() === 0 ? format(d, PeriodType.Day, { variant: "short" }) : "";
                    }}
                    rule
                  />
                  <Bars radius={4} rounded="top" class="fill-mask/70" />
                </Svg>
                <Tooltip.Root
                  variant="none"
                  x="data"
                  y="data"
                  yOffset={4}
                  anchor="bottom"
                  motion={false}
                  contained={false}
                  class="rounded-xl border border-gray-400 bg-white p-2 whitespace-nowrap drop-shadow-lg"
                  let:data
                >
                  <Tooltip.Item
                    classes={{
                      root: "flex flex-col justify-center items-center gap-2",
                      label: "text-2xs text-black mx-auto tracking-tighter font-extralight",
                      value: "font-bold text-sm text-black",
                    }}
                    value={`${data.value} times`}
                    valueAlign="center"
                    label={`${format(data.date, PeriodType.Custom, { custom: "eeee, MMMM d" })}`}
                  />
                </Tooltip.Root>
              </Chart>
            </div>
          </div>
        </TabItem>

        <!-- SCORE -->
        <TabItem class="ms-8 w-32">
          <TabItemTitle slot="title" name="score" title="myAir Score" />

          <!--5. MYAIR SCORE Chart // sleepScore is MYAIR SCORE -->
          <div class="m-4 rounded">
            <div class="h-[500px]">
              <Chart
                data={filteredData.sleepScoreData}
                x="date"
                xScale={scaleBand().padding(0.4)}
                y="value"
                yDomain={[0, null]}
                padding={{ left: 32, bottom: 24 }}
                tooltip={{ mode: "band" }}
              >
                <Svg>
                  <Axis
                    placement="left"
                    grid
                    rule
                    label="Score"
                    classes={{
                      label: "m-8 font-semibold text-base",
                    }}
                  />
                  <Axis
                    placement="bottom"
                    format={(d) => {
                      const date = new Date(d);
                      return date.getDay() === 0 ? format(d, PeriodType.Day, { variant: "short" }) : "";
                    }}
                    rule
                  />
                  <Bars radius={4} rounded="top" class="fill-score/80" />
                </Svg>
                <Tooltip.Root
                  variant="none"
                  x="data"
                  y="data"
                  yOffset={4}
                  anchor="bottom"
                  motion={false}
                  contained={false}
                  class="rounded-xl border border-gray-400 bg-white p-2 whitespace-nowrap drop-shadow-lg"
                  let:data
                >
                  <Tooltip.Item
                    classes={{
                      root: "flex flex-col justify-center items-center gap-2",
                      label: "text-2xs text-black mx-auto tracking-tighter font-extralight",
                      value: "font-bold text-sm text-black",
                    }}
                    value={`${data.value}/100`}
                    valueAlign="center"
                    label={`${format(data.date, PeriodType.Custom, { custom: "eeee, MMMM d" })}`}
                  />
                </Tooltip.Root>
              </Chart>
            </div>
          </div>
        </TabItem>
      </Tabs>
    </div>
  {/if}
</div>
