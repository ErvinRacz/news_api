# News API

A simple DENO test project that interacts with the GNews API.

## Getting Started

This solution uses DENO as the server runtime for JavaScript.

1. [Install your IDE plugin for DENO.](https://docs.deno.com/runtime/getting_started/setup_your_environment/#neovim-0.6%2B-using-the-built-in-language-server)

2. Choose _[`A. Full Stack Installation`](#a-full-stack-installation)_(Docker,
   Colima, Kubernetes, DENO, Memcached) or
   _[`B. Bare Minimum Installation`](#b-bare-minimum-installation)_(just DENO :( ) path
   for the dev tools.

### A. Full Stack Installation (only Linux, MacOS, or WLS)
```
                       ┌─────┐                         
                       │user │                         
                       └──┬──┘                         
                          │                            
                  ┌───────▼────────┐                   
     k8s cluster  │                │                   
┌─────────────────│  k8s proxy/ic  │──────────────────┐
│                 │                │                  │
│                 └───────┬────────┘                  │
│                         │                           │
│                 ┌───────▼────────┐                  │
│                 │ loadbalancer   │                  │
│           ┌─────┴───────┬────────┴─────┐            │
│  ┌────────┼─────────────┼──────────────┼────────┐   │
│  │ deploym│nt           │              │        │   │
│  │        │             │              │        │   │
│  │  ┌─────▼──┐     ┌────▼───┐     ┌────▼────┐   │   │
│  │  │        │     │        │     │         │   │   │
│  │  │ news_api     │news_api│     │ news_api│   │   │
│  │  │        │     │        │     │         │   │   │
│  │  └────┬───┘     └────┬───┘     └─────┬───┘   │   │
│  │       │              │               │       │   │
│  └───────┼──────────────┼───────────────┼───────┘   │
│          │    ┌─────────▼─────────┐     │           │
│          │    │                   │     │           │
│          │    │                   │     │           │
│          └────►  memcache service       │           │
│               │                   ◄─────┘           │
│               │                   │                 │
│               └───────────────────┘                 │
└─────────────────────────────────────────────────────┘
```
3. Install Nix: the BEST package manager with a popular installer and default
   options.
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
   ```

You can later uninstall it via `/nix/nix-installer uninstall`.

[Alternatively, follow the official guide.](https://nixos.org/download/#nix-install-linux)

4. Bootstrap the full stack dev environment:
   ```bash
   nix develop github:ErvinRacz/news_api#bootstrap && cd news_api && nix develop .
   ```
Note! Next time just use `nix develop .`

This will install all the dependencies required to run the whole stack. To have those dependencies available, just CD to the news API project in your shell. You can learn more about [devshell](https://nixos.wiki/wiki/Development_environment_with_nix-shell).

5. Build the docker image, start colima, apply the full-stack deployment, and use port forwarding by only this command:
   ```bash
   just docker-build && just full-stack
   ```

6. Open up a new shell and test if the API is available:
   ```bash
   curl -X GET "http://localhost:8000/news?n=5" -H "Accept: application/json" | jq
   ```

### B. Bare Minimum Installation (Linux, MacOS, Windows)

3. [Install DENO following the official guide.](https://docs.deno.com/runtime/fundamentals/installation/)

4. [Install git-crypt.](https://github.com/AGWA/git-crypt)

5. Normally the secret shouldn't be shared, but for the sake of simplifying testing, here it is. Unlock `GNEWS API KEY` secret by `git-crypt unlock .git-crypt-key`

6. Set the environment variables and run `deno task dev`. You can find my credentials in the .secret directory after decryption.
```bash
GNEWS_API_KEY=apikey GNEWS_BASE_URL=baseurl NEWS_API_PORT=8000 deno task dev
```

## News API Documentation

This API provides access to news articles, allowing you to fetch articles, search by keywords, and filter by title or author.

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Get News Articles

**Endpoint:**
```
GET /news
```

**Description:**
Fetches a specific number of news articles.

**Query Parameters:**
- `n`: (optional) Number of articles to fetch. The default is 10.

**Example:**
```bash
curl -X GET "http://localhost:8000/news?n=5" -H "Accept: application/json" | jq
```

#### 2. Search News by Keyword

**Endpoint:**
```
GET /news/search
```

**Description:**
Searches for news articles containing the specified keyword.

**Query Parameters:**
- `q`: (required) The keyword to search for.

**Example:**
```bash
curl -X GET "http://localhost:8000/news/search?q=dog" -H "Accept: application/json" | jq
```

#### 3. Find News by Title

**Endpoint:**
```
GET /news/byTitle
```

**Description:**
Finds news articles that match the specified title.

**Query Parameters:**
- `title`: (required) The title of the article to find.

**Example:**
```bash
curl -X GET "http://localhost:8000/news/byTitle?title=Remarkable%20survival%20of%20dog%20feared%20to%20have%20died" -H "Accept: application/json" | jq
```

# Futher Considerations:
   - Retry mechanism for the API calls to GNEWS.
   - Remove the secret key file from the repo
### API Design
   - The router has not been properly typed yet. The structure of return types could be provided.
   - Using OpenAPI docs and serving the OpenAPI UI. `https://deno.land/x/openapi@0.1.0/mod.ts` could be used for that.
   - I kept the current API design simple, but an important improvement point would be to introduce pagination for the endpoints. This is especially important if we provide generic search terms and a huge number of articles would be expected to match the query.
### Tests
   - Write more tests whether that is end-to-end api test or unit tests
   - Introduce code coverage metrics
   - The superoak tests hang. There must be a configuration issue that is to be solved.
### CI/CD
   - Nix can help by a lot to implement these pipelines
   - CI checks should be put in place to check for linting, formatting and the tests passing
   - secretes manager for k8s etc
