import { NewsSource } from "../NewsSource/NewsSource.ts";

export class NewsService {
  constructor(
    private newsSource: NewsSource,
    // private cache: NewsCache
  ) {}

  async fetchNewsArticles(n: number) {
    // const cacheKey = `news-${n}`;
    // const cachedArticles = this.cache.get(cacheKey);
    // if (cachedArticles) return cachedArticles;

    const articles = await this.newsSource.fetchNews(n);
    // this.cache.set(cacheKey, articles);
    return articles;
  }

  async searchNewsByKeyword(keyword: string) {
    // const cacheKey = `search-${keyword}`;
    // const cachedArticles = this.cache.get(cacheKey);
    // if (cachedArticles) return cachedArticles;

    const articles = await this.newsSource.searchByKeyword(keyword);
    // this.cache.set(cacheKey, articles);
    return articles;
  }

  async findNewsByTitle(title: string) {
    // const cacheKey = `title-${title}`;
    // const cachedArticles = this.cache.get(cacheKey);
    // if (cachedArticles) return cachedArticles;

    const articles = await this.newsSource.findByTitle(title);
    // this.cache.set(cacheKey, articles);
    return articles;
  }
}
