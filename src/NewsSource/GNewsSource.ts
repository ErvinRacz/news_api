import { z } from "zod";

const sourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
  url: z.string().url(),
  image: z.string().url(),
  publishedAt: z.string().datetime(),
  source: sourceSchema,
});
