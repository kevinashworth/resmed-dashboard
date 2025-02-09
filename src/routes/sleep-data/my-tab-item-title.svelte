<script lang="ts">
  import type { Component } from "svelte";
  import AhiEventsIcon from "./icons/ahi-events.svelte";
  import MaskLeakIcon from "./icons/mask-leak.svelte";
  import MaskOnOffIcon from "./icons/mask-on-off.svelte";
  import SleepScoreIcon from "./icons/sleep-score.svelte";
  import UsageHoursIcon from "./icons/usage-hours.svelte";

  import type { IconNames } from "$lib/types";

  interface Props {
    name: IconNames;
    title: string;
  }

  let { name = "hours", title = "Usage Hours" }: Props = $props();

  type FillClassMap = {
    [key: string]: string;
  };
  let fillClass: FillClassMap = {
    events: "fill-events",
    hours: "fill-hours",
    leak: "fill-seal",
    mask: "fill-mask",
    score: "fill-score",
  };

  type IconComponentMap = {
    [key: string]: Component; // Use IconNames as the keys
  };
  let iconComponent: IconComponentMap = {
    events: AhiEventsIcon,
    hours: UsageHoursIcon,
    leak: MaskLeakIcon,
    mask: MaskOnOffIcon,
    score: SleepScoreIcon,
  };
  let IconComponent = iconComponent[name];
</script>

<div class="flex flex-col items-center justify-start">
  <IconComponent class={[fillClass[name], "size-12"]} />
  <h2 class="text-xs font-medium whitespace-nowrap text-gray-500 uppercase">
    {title}
  </h2>
  <div class="h-0 w-32 bg-white in-[.active]:bg-gray-50"></div>
</div>
