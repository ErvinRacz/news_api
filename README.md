# News API

A simple DENO test project that interacts with the GNews API.

## Getting Started

This solution uses DENO as the server runtime for JavaScript.

1. [Install your IDE plugin for DENO.](https://docs.deno.com/runtime/getting_started/setup_your_environment/#neovim-0.6%2B-using-the-built-in-language-server)

2. Choose _[`A. Full Stack Installation`](#a-full-stack-installation)_(Docker,
   Colima, Kubernetes, DENO, Memcached) or
   _[`B. Bare Minimum Installation`](#b-bare-minimum-installation)_(DENO) path
   for the dev tools.

### A. Full Stack Installation (only Linux, MacOS or WLS)

3. Install Nix: the BEST package manager with a popular installer and default
   options.
   `curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install`.

You can later uninstall it via `/nix/nix-installer uninstall`.

[Alternatively follow the official guide.](https://nixos.org/download/#nix-install-linux)

4. Bootstrap the full stack dev environment:
   `nix develop github:ErvinRacz/news_api#bootstrap && cd news_api`

5. Normally the secret shouldn't be shared in a readme, but for the sake of simplifying testing, here it is. Unlock `GNEWS API KEY` secret by `git-crypt unlock .git-crypt-key`

### B. Bare Minimum Installation (Linux, MacOS, Windows)

3. [Install DENO following the official guide.](https://docs.deno.com/runtime/fundamentals/installation/)

4. [Install git-crypt.](https://github.com/AGWA/git-crypt)

5. Normally the secret shouldn't be shared, but for the sake of simplifying testing, here it is. Unlock `GNEWS API KEY` secret by `git-crypt unlock .git-crypt-key`

Run these commands to get started

cd news_api

# Run the program

deno run main.ts

# Run the program and watch for file changes

deno task dev

# Run the tests

deno test


## Considerations:
   - Remove the secret key file from the repo
### API Design
   - I kept the current API design simple, but an important improvement point would be to intruduce pagination for the endpoints. This is especially important if we provide generic serach terms and a huge number of articles would be expected to match the query.
### Tests
   - Write more tests whether that is end-to-end api test or unit tests
   - Introduce code coverage metrics
### CI/CD
   - Nix can help by a lot to implement these pipelines
   - CI checks should be put in palce to check for linting, formatting and the tests passing
