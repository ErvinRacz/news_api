import { GnewsArticle } from "./GNewsSource.ts";

// Normally this shouldn't depend on the implementation - this vialates the dependency inversion principle, but we want to keep this simple for now
export type Article = GnewsArticle;

export interface NewsSource {
  fetchNews(n: number): Promise<Article[]>;
  searchByKeyword(keyword: string): Promise<Article[]>;
  findByTitle(title: string): Promise<Article[]>;
}
