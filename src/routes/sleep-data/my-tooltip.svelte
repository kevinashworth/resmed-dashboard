<script lang="ts">
  import { Axis, Bars, Chart, Rule, Svg, Text, Tooltip } from "layerchart";
  import { format, PeriodType } from "@layerstack/utils";

  interface Props {
    valueFormatFn: (value: number) => string;
    labelFormatFn?: (date: Date) => string;
  }

  function defaultLabelFormatFn(date: Date): string {
    return format(date, PeriodType.Custom, { custom: "eeee, MMMM d" });
  }

  let { valueFormatFn, labelFormatFn = defaultLabelFormatFn }: Props = $props();
</script>

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
    value={valueFormatFn(data.value)}
    valueAlign="center"
    label={labelFormatFn(data.date)}
  />
</Tooltip.Root>
