import { NewsCache } from "./NewsCache.ts";
import memjs from "npm:memjs";
import { Article } from "../../NewsSource/NewsSource.ts";

export class MemcachedNewsCache implements NewsCache {
  private client: memjs.Client;

  constructor(servers: string, user: string, password: string) {
    this.client = memjs.Client.create(servers, {
      username: user,
      password: password,
    });
  }

  async get(key: string): Promise<Article[] | null> {
    const result = await this.client.get(key);
    console.log("get from memcached, result value: ", result.value);
    return result.value ? JSON.parse(result.value.toString()) as Article[] : null;
  }

  async set(key: string, value: Article[]): Promise<void> {
    console.log("set to memcached, key is: ", key);
    await this.client.set(key, JSON.stringify(value), { expires: 3600 });
  }
}
