import { z } from "zod";
import { EnvConfig } from "../Utils/EnvConfig.ts";
import { NewsSource } from "./NewsSource.ts";
import { retryFetch } from "../Utils/Client.ts";

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

  async fetchNews(n: number): Promise<GnewsArticle[]> {
    const res = await retryFetch(
      GNewsSource.getUrlWithKey(`/top-headlines?max=${n}`),
    );
    const data = await res.json();
    if (data.errors) {
      throw Error(JSON.stringify(data.errors));
    }
    return await ARTICLE_SCHEMA.array().parseAsync(data.articles);
  }

  async searchByKeyword(keyword: string): Promise<GnewsArticle[]> {
    const res = await retryFetch(
      GNewsSource.getUrlWithKey(`/search?q=${keyword}`),
    );
    const data = await res.json();
    if (data.errors) {
      throw Error(JSON.stringify(data.errors));
    }
    return await ARTICLE_SCHEMA.array().parseAsync(data.articles);
  }

  async findByTitle(title: string): Promise<GnewsArticle[]> {
    const res = await retryFetch(
      GNewsSource.getUrlWithKey(`/search?q=${title}&in=title`),
    );
    const data = await res.json();
    if (data.errors) {
      throw Error(JSON.stringify(data.errors));
    }
    return await ARTICLE_SCHEMA.array().parseAsync(data.articles);
  }
}
