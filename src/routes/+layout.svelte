<script>
  let { children } = $props();
  import "../app.css";
</script>

<nav class="flex gap-4 bg-amber-50">
  <a class="m-1 p-1 hover:underline" href="/">Home</a>
  <a class="m-1 p-1 hover:underline" href="/sleep-data">Sleep Data</a>
</nav>

<main class="m-1 p-1">
  {@render children()}
</main>
