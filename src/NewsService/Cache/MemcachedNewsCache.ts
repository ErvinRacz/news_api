import { NewsCache } from "./NewsCache.ts";
import { Article } from "../../NewsSource/NewsSource.ts";

export class MemcachedNewsCache implements NewsCache {
  private host: string;
  private port: number;
  private decoder = new TextDecoder();

  constructor(servers: string) {
    const [host, port] = servers.split(":");
    this.host = host;
    this.port = parseInt(port, 10);
  }

  private async connect(): Promise<Deno.Conn> {
    return await Deno.connect({ hostname: this.host, port: this.port });
  }

  async get(key: string): Promise<Article[] | null> {
    const connection = await this.connect();
    await connection.write(new TextEncoder().encode(`get ${key}\r\n`));

    const buffer = new Uint8Array(1024);
    const bytesRead = await connection.read(buffer);

    connection.close();

    if (bytesRead === null) {
      return null;
    }

    const response = this.decoder.decode(buffer.subarray(0, bytesRead));
    if (response.startsWith("VALUE")) {
      const [, , , value] = response.split("\r\n");
      return JSON.parse(value) as Article[];
    }

    return null;
  }

  async set(key: string, value: Article[]): Promise<void> {
    const connection = await this.connect();
    const stringValue = JSON.stringify(value);
    await connection.write(
      new TextEncoder().encode(
        `set ${key} 0 3600 ${stringValue.length}\r\n${stringValue}\r\n`,
      ),
    );

    const buffer = new Uint8Array(1024);
    await connection.read(buffer);

    connection.close();
  }
}
