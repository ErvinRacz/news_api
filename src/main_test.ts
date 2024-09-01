import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { Status } from "@oak/oak";
import { assertEquals } from "@std/assert";

import { Article, NewsSource } from "./NewsSource/NewsSource.ts";
import { NewsService } from "./NewsService/NewsService.ts";
// import { InMemoryCache } from "./InMemoryCache.ts";
import { createApplication } from "./main.ts";

class MockNewsSource implements NewsSource {
  private generateMockArticle(index: number): Article {
    return {
      title: `Mock Article ${index}`,
      description: `This is a mock description for article ${index}`,
      content: `This is the full content of the mock article ${index}`,
      url: `https://example.com/mock-article-${index}`,
      image: `https://example.com/mock-image-${index}.jpg`,
      publishedAt: new Date().toISOString(),
      source: {
        name: `Mock Source ${index}`,
        url: `https://example.com/mock-source-${index}`,
      },
    };
  }

  fetchNews(n: number): Promise<Article[]> {
    return Promise.resolve(
      Array.from({ length: n }, (_, i) => this.generateMockArticle(i + 1)),
    );
  }

  searchByKeyword(keyword: string): Promise<Article[]> {
    return Promise.resolve(
      [
        {
          ...this.generateMockArticle(1),
          title: `Mock Article with ${keyword}`,
        },
      ],
    );
  }

  findByTitle(title: string): Promise<Article[]> {
    return Promise.resolve(
      [
        {
          ...this.generateMockArticle(1),
          title: title,
        },
      ],
    );
  }

  findByAuthor(author: string): Promise<Article[]> {
    return Promise.resolve(
      [
        {
          ...this.generateMockArticle(1),
          source: {
            name: author,
            url: `https://example.com/mock-source-author`,
          },
        },
      ],
    );
  }
}

const mockNewsSource = new MockNewsSource();
// const newsCache = new InMemoryCache();
const newsService = new NewsService(mockNewsSource);
const app = createApplication(newsService);

Deno.test("GET /news should return N articles", async () => {
  const request = await superoak(app);
  const response = await request.get("/news?n=5").expect(200);

  assertEquals(response.body.articles.length, 5);
  assertEquals(response.body.articles[0].title, "Mock Article 1");
});

Deno.test("GET /news/search should return articles matching the keyword", async () => {
  const request = await superoak(app);
  const response = await request.get("/news/search?q=deno").expect(200);

  assertEquals(response.body.articles[0].title, "Mock Article with deno");
});

Deno.test("GET /news/title should return articles matching the title", async () => {
  const request = await superoak(app);
  const response = await request.get("/news/title?title=SpecificTitle").expect(
    200,
  );

  assertEquals(response.body.articles[0].title, "SpecificTitle");
});

Deno.test("GET /news/author should return articles by the author", async () => {
  const request = await superoak(app);
  const response = await request.get("/news/author?author=TestAuthor").expect(
    200,
  );

  assertEquals(response.body.articles[0].author, "TestAuthor");
});

Deno.test("GET /news should return 400 for non-integer 'n'", async () => {
  const request = await superoak(app);
  await request.get("/news?n=abc").expect(Status.BadRequest);
});

Deno.test("GET /news should return 400 for negative 'n'", async () => {
  const request = await superoak(app);
  await request.get("/news?n=-5").expect(Status.BadRequest);
});

Deno.test("GET /news/search should return 400 if 'q' is missing", async () => {
  const request = await superoak(app);
  await request.get("/news/search").expect(Status.BadRequest);
});

Deno.test("GET /news/search should return 406 if 'q' is too short", async () => {
  const request = await superoak(app);
  await request.get("/news/search?q=a").expect(Status.NotAcceptable);
});

Deno.test("GET /news/byTitle should return 400 if 'title' is missing", async () => {
  const request = await superoak(app);
  await request.get("/news/byTitle").expect(Status.BadRequest);
});

Deno.test("GET /news/byTitle should return 406 if 'title' is too short", async () => {
  const request = await superoak(app);
  await request.get("/news/byTitle?title=ab").expect(Status.NotAcceptable);
});

Deno.test("GET /news/byAuthor should return 400 if 'author' is missing", async () => {
  const request = await superoak(app);
  await request.get("/news/byAuthor").expect(Status.BadRequest);
});

Deno.test("GET /news/byAuthor should return 406 if 'author' is too short", async () => {
  const request = await superoak(app);
  await request.get("/news/byAuthor?author=ab").expect(Status.NotAcceptable);
});
