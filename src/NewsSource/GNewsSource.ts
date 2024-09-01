import { z } from "zod";
import { EnvConfig } from "../Utils/EnvConfig.ts";
import { NewsSource } from "./NewsSource.ts";

const GNEWS_API_KEY = EnvConfig.getEnvVar("GNEWS_API_KEY");
const GNEWS_BASE_URL = EnvConfig.getEnvVar("GNEWS_BASE_URL");

const SOURCE_SCHEMA = z.object({
  name: z.string(),
  url: z.string().url(),
});

const ARTICLE_SCHEMA = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
  url: z.string().url(),
  image: z.string().url(),
  publishedAt: z.string().datetime(),
  source: SOURCE_SCHEMA,
});

export type GnewsArticle = z.infer<typeof ARTICLE_SCHEMA>;

export class GNewsSource implements NewsSource {
  static getUrlWithKey(endpoint: string) {
    const url = new URL(`${GNEWS_BASE_URL}${endpoint}`);
    const params = new URLSearchParams(url.search);
    params.set("apikey", GNEWS_API_KEY);
    url.search = params.toString();
    return url;
  }

  fetchNews(n: number): Promise<GnewsArticle[]> {
    const response = fetch(
      GNewsSource.getUrlWithKey(`/top-headlines?max=${n}`),
    );
    return response
      .then((res) => res.json())
      .then((data) => ARTICLE_SCHEMA.array().parseAsync(data.articles));
  }

  searchByKeyword(keyword: string): Promise<GnewsArticle[]> {
    const response = fetch(
      GNewsSource.getUrlWithKey(`/search?q=${keyword}`),
    );
    return response
      .then((res) => res.json())
      .then((data) => ARTICLE_SCHEMA.array().parseAsync(data.articles));
  }

  findByTitle(title: string): Promise<GnewsArticle[]> {
    const response = fetch(
      GNewsSource.getUrlWithKey(`/search?q=intitle:"${title}"`),
    );
    return response
      .then((res) => res.json())
      .then((data) => ARTICLE_SCHEMA.array().parseAsync(data.articles));
  }

  findByAuthor(author: string): Promise<GnewsArticle[]> {
    const response = fetch(
      GNewsSource.getUrlWithKey(`/search?q=inauthor:"${author}"`),
    );
    return response
      .then((res) => res.json())
      .then((data) => ARTICLE_SCHEMA.array().parseAsync(data.articles));
  }
}
