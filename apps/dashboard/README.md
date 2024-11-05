# thirdweb.com

This repo contains the full source for all of thirdweb.com and the thirdweb dashboard.

## Starting a local dev server

Run from the root folder (thirdweb-dev/js):

```sh
cd <path/to/thirdweb-dev/js>
pnpm dashboard
```

### Building for production

```sh
pnpm build
```

### Environment Variables

Some env vars can be overridden that are required for some external services to work. You can find them in the `.env.example` file at the root level of the project including some descriptions of what they are used for.

To define env vars please create a `.env` file based on the `.env.example` template at the root level of the project. This file is ignored by git so you can safely add it to your local copy of the project.

**Add your thirdweb clientID and secret key to build a basic functioning version of the site.**

## Code Structure and Style Guide

### Components
- Components should go in a `components` folder next to the app page they are used in.
- If a component is reused in multiple pages, it should go in the lowest level route folder it is used in. For example, if a chart component is used in all analytics subroutes `/analytics/...`, it should go in the `/analytics/components` folder.
- All low-level components such as buttons, inputs, etc. should be shadcn components found in `@/ui`.
- All composed components reused across all page routes are `blocks`, and should also go in the `@/ui` folder.

### Data fetching
- Use RSC wherever possible.
- Write data fetching code in its own function in the same file as the component it is used in, not exported.
- If the same data fetching function is used in multiple components, place it in a file in an `api` folder at the lowest level possible (just like components). If you need to do this you probable aren't organizing your components properly.
