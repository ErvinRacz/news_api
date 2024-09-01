import { assertEquals } from "@std/assert/equals";
import { GNewsSource } from "./GNewsSource.ts";

// Assuming you have constants defined somewhere:
const GNEWS_BASE_URL = Deno.env.get("GNEWS_BASE_URL") ?? "https://gnews.io/api/v4";
const GNEWS_API_KEY = Deno.env.get("GNEWS_API_KEY") ?? "test_api_key";

Deno.env.set("GNEWS_BASE_URL", GNEWS_BASE_URL);
Deno.env.set("GNEWS_API_KEY", GNEWS_API_KEY);

Deno.test("getUrlWithKey - Basic Test with No Existing Params", () => {
  const endpoint = "/top-headlines";
  const result = GNewsSource.getUrlWithKey(endpoint).toString();
  const expected = `${GNEWS_BASE_URL}${endpoint}?apikey=${GNEWS_API_KEY}`;

  assertEquals(result, expected);
});

Deno.test("getUrlWithKey - Test with Existing Params", () => {
  const endpoint = "/top-headlines?country=us";
  const result = GNewsSource.getUrlWithKey(endpoint).toString();
  const expected =
    `${GNEWS_BASE_URL}/top-headlines?country=us&apikey=${GNEWS_API_KEY}`;

  assertEquals(result, expected);
});

Deno.test("getUrlWithKey - Test with Fragment in URL", () => {
  const endpoint = "/top-headlines#section";
  const result = GNewsSource.getUrlWithKey(endpoint).toString();
  const expected =
    `${GNEWS_BASE_URL}/top-headlines?apikey=${GNEWS_API_KEY}#section`;

  assertEquals(result, expected);
});

Deno.test("getUrlWithKey - Test with Special Characters in Params", () => {
  const endpoint = "/top-headlines?query=special&char=*&test=value";
  const result = GNewsSource.getUrlWithKey(endpoint).toString();
  const expected =
    `${GNEWS_BASE_URL}/top-headlines?query=special&char=%2A&test=value&apikey=${GNEWS_API_KEY}`;

  assertEquals(result, expected);
});

Deno.test("getUrlWithKey - Test with Overwriting Existing API Key", () => {
  const endpoint = "/top-headlines?apikey=old_key";
  const result = GNewsSource.getUrlWithKey(endpoint).toString();
  const expected = `${GNEWS_BASE_URL}/top-headlines?apikey=${GNEWS_API_KEY}`;

  assertEquals(result, expected);
});
