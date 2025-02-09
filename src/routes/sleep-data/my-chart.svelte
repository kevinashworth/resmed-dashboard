<script lang="ts">
  import { Axis, Bars, Chart, Spline, Svg, Text } from "layerchart";
  import { format, PeriodType } from "@layerstack/utils";
  import { scaleBand } from "d3-scale";

  import MyTooltip from "./my-tooltip.svelte";
  import type { ChartData } from "$lib/types";

  interface Props {
    axisFormatFn?: (d: number) => string;
    classes: {
      bars: string;
      spline: string;
      text: string;
    };
    data: ChartData[];
    lastMovingAverageDataPoint?: number;
    leftAxisLabel: string;
    splineData: ChartData[];
    valueFormatFn: (value: number) => string;
  }

  let {
    axisFormatFn,
    classes = {
      bars: "fill-score/80",
      spline: "stroke-score invert",
      text: "fill-score stroke-score/60 text-xs invert",
    },
    data,
    lastMovingAverageDataPoint = 0,
    leftAxisLabel,
    splineData,
    valueFormatFn,
  }: Props = $props();
</script>

<Chart
  {data}
  x="date"
  xScale={scaleBand().padding(0.4)}
  y="value"
  yDomain={[0, null]}
  padding={{ left: 32, bottom: 24 }}
  tooltip={{ mode: "band" }}
  let:width
  let:yScale
>
  <Svg>
    <Axis
      placement="left"
      format={axisFormatFn}
      grid
      rule
      label={leftAxisLabel}
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
    <Bars radius={4} rounded="top" class={classes.bars} />
    <Spline data={splineData} class={classes.spline} />
    <Text
      x={width}
      y={lastMovingAverageDataPoint ? yScale(lastMovingAverageDataPoint) : 0}
      dy={lastMovingAverageDataPoint ? -12 : 0}
      value="Moving Average"
      textAnchor="end"
      class={classes.text}
    />
  </Svg>
  <MyTooltip {valueFormatFn} />
</Chart>
