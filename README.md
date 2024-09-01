# News API
A simple DENO test project that interacts with the GNews API.

## Getting Started

This solution uses DENO as the server runtime for JavaScript. 

1. [Install your IDE plugin for DENO.](https://docs.deno.com/runtime/getting_started/setup_your_environment/#neovim-0.6%2B-using-the-built-in-language-server)

2. Choose *[`A. Full Stack Installation`](#a-full-stack-installation)*(Docker, Colima, Kubernetes, DENO, Memcached) or *[`B. Bare Minimum Installation`](#b-bare-minimum-installation)*(DENO) path for the dev tools.

### A. Full Stack Installation (only Linux, MacOS or WLS)

3. Install Nix: the BEST package manager with a popular installer and default options.
`curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install`
You can later uninstall it via `/nix/nix-installer uninstall`.

[Alternatively follow the official guide.](https://nixos.org/download/#nix-install-linux)

4. Bootstrap the full stack dev environment: `nix develop github:ErvinRacz/news_api#bootstrap && cd news_api`

### B. Bare Minimum Installation (Linux, MacOS, Windows)

3. [Install DENO following the official guide.](https://docs.deno.com/runtime/fundamentals/installation/)


Run these commands to get started

  cd news_api

  # Run the program
  deno run main.ts

  # Run the program and watch for file changes
  deno task dev

  # Run the tests
  deno test
