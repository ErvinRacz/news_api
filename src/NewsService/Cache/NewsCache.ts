import { Article } from "../../NewsSource/NewsSource.ts";

export interface NewsCache {
  get(key: string): Promise<Article[] | null>;
  set(key: string, value: Article[]): void;
}
