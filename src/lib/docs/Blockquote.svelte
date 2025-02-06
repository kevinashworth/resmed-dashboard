<script lang="ts">
  import { mdiInformation } from "@mdi/js";
  import { Icon } from "svelte-ux";
  import { cls } from "@layerstack/tailwind";
</script>

<div
  class={cls(
    "bg-primary/10 border-primary/30 border-l-primary text-primary my-4 flex items-center gap-2 rounded border border-l-[6px] px-4 py-2 text-sm",
    "[&>a]:decoration-primary/50 [&>a]:font-medium [&>a]:underline [&>a]:decoration-dashed [&>a]:underline-offset-2",
  )}
>
  <Icon data={mdiInformation} class="text-primary" />
  <slot />
</div>
