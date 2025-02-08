# ResMed Sleep Data Dashboard

This is a simple personal project. I built a web app to view my `myAir` data in a new way, hoping to see my data over a variety of timespans. At the same time, I wanted to learn more about the latest version of `Svelte`, and decided to build an app of some potential usefulness to me.

Feel free to use this for yourself. You just need to get your own myAir data. To do so, copy your data into the `data/monthlySleepRecords` folder, with filenames of the pattern `2025-02.json`. Each month is a POST network request to a URL ending in `/graphql`. So, open your browser’s dev tools and copy the request’s results from the dev tools to a file that you create. It’s GraphQL data, but you can save it as-is to JSON.

View the Dashboard at [myair-resmed-dashboard.s3-website-us-west-2.amazonaws.com](http://myair-resmed-dashboard.s3-website-us-west-2.amazonaws.com/)
