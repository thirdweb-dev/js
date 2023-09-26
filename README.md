# thirdweb.com

This repo contains the full source for all of thirdweb.com and the thirdweb dashboard.

## Building

### Install dependencies

We use `bun`.

_You can install bun on your machine by following the instructions on: [bun.sh](https://bun.sh)_

```sh
bun install
```

### Starting local dev server.

```sh
bun run dev
```

### Building for production

```sh
bun run build
```

### Environment Variables

Some env vars can be overridden that are required for some external services to work. You can find them in the `.env.example` file at the root level of the project including some descriptions of what they are used for.

To define env vars please create a `.env` file based on the `.env.example` template at the root level of the project. This file is ignored by git so you can safely add it to your local copy of the project.

**Add your thirdweb clientID and secret key to build a basic functioning version of the site.**
