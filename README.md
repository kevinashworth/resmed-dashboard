# Resmed Dashboard

A personal project. I built a web app to view my `myAir` data in a new way. I wanted to learn more about the latest verson of Svelte, and decided to build an app of some potential usefulness to me.

Feel free to use this for yourself. You'd need to copy your own `myAir` data, month by month, from the dev tools into the History folder, with filenames of the pattern `2025-01.json`.

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
