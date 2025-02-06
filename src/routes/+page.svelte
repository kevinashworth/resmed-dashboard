<section class="mx-auto w-full bg-white bg-gradient-to-r p-2 sm:p-6">
  <section class="relative py-6 sm:py-10">
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
      <div class="max-w-screen-md">
        <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">ResMed Sleep Data Dashboard</h2>
        <p class="mb-6 font-light text-gray-500 md:text-lg">
          This is a simple personal project. I built a web app to view my <span class="font-mono text-amber-600"
            >myAir</span
          >
          data in a new way, hoping to see my data over a variety of timespans. At the same time, I wanted to learn more
          about the latest verson of <b>Svelte</b>, and decided to build an app of some potential usefulness to me.
        </p>

        <p class="mb-6 font-light text-gray-500 md:text-lg">
          Feel free to use this for yourself. You'd just need to copy your own <span class="font-mono text-amber-600"
            >myAir</span
          >
          data from the dev tools while you're logged in to your account. Copy it into the
          <span class="font-mono text-amber-900">data/monthlySleepRecords</span>
          folder, with filenames of the pattern
          <span class="font-mono text-amber-900">2025-01.json</span>. Each month is a POST network request to
          <span class="font-mono text-amber-900">https://graphql.myair-prd.dht.live/graphql</span>, just copy its
          results from the dev tools to a file that you create. It's GraphQL data, but you can save it as-is to JSON.
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <a
            href="/sleep-data"
            class="inline-flex items-center justify-center rounded-lg bg-red-700 px-5 py-3 text-center text-base font-medium text-white focus-within:ring-4 focus-within:ring-red-300 focus-within:outline-none hover:bg-red-800 dark:bg-red-600 dark:focus-within:ring-red-900 dark:hover:bg-red-700"
            role="button">Sleep Data</a
          >
        </div>
      </div>
    </div>
  </section>
</section>
