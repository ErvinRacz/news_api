import { Application, Context, Router, Status } from "@oak/oak";
import { EnvConfig } from "./Utils/EnvConfig.ts";
import { GNewsSource } from "./NewsSource/GNewsSource.ts";
import { NewsService } from "./NewsService/NewsService.ts";

const newsSource = new GNewsSource();
// const newsCache = new InMemoryCache();
const newsService = new NewsService(newsSource);

export function createRouter(newsService: NewsService) {
  const router = new Router();

  const validateInteger = (
    value: string | null,
    context: Context,
    name: string,
  ) => {
    const numValue = Number(value);
    context.assert(
      !isNaN(numValue) && Number.isInteger(numValue) && numValue > 0,
      Status.BadRequest,
      `${name} must be a positive integer`,
    );
    return numValue;
  };

  router
    .get("/news", async (context) => {
      const n = context.request.url.searchParams.get("n");
      const numArticles = n ? validateInteger(n, context, "n") : 10;
      const articles = await newsService.fetchNewsArticles(numArticles);
      context.response.body = articles;
    })
    .get("/news/search", async (context: Context) => {
      const q: string | null = context.request.url.searchParams.get("q");
      context.assert(q, Status.BadRequest, "Query parameter 'q' is required");
      context.assert(
        q.length > 2,
        Status.NotAcceptable,
        "'q' must be at least 3 characters long",
      );
      const articles = await newsService.searchNewsByKeyword(q);
      context.response.body = articles;
    })
    .get("/news/byTitle", async (context: Context) => {
      const title = context.request.url.searchParams.get("title");
      context.assert(
        title,
        Status.BadRequest,
        "Query parameter 'title' is required",
      );
      context.assert(
        title.length > 2,
        Status.NotAcceptable,
        "'title' must be at least 3 characters long",
      );
      const articles = await newsService.findNewsByTitle(title);
      context.response.body = articles;
    });
  return router;
}

export function createApplication(newsService: NewsService) {
  const app = new Application();
  const router = createRouter(newsService);
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
}

const app = createApplication(newsService);

const PORT = EnvConfig.getIntEnvVar("PORT");
await app.listen({ port: PORT });
