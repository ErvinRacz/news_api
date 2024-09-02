import { Article } from "../../NewsSource/NewsSource.ts";
import { NewsCache } from "./NewsCache.ts";

export class SimpleJsNewsCache implements NewsCache {
  private cache: Map<string, Article[]>;

  constructor() {
    this.cache = new Map<string, Article[]>();
  }

  get(key: string): Promise<Article[] | null> {
    return Promise.resolve(this.cache.get(key) || null);
  }

  set(key: string, value: Article[]): void {
    this.cache.set(key, value);
  }
}
