import { defineCollection, z } from "astro:content";

const products = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    price: z.number(),
    variants: z.number(),
    tag: z.enum(["terbaru", "terlaris", "both"]),
    badge: z.string().optional(),
    image: z.string(),
    description: z.string().optional(),
    sku: z.string().optional(),
    material: z.string().optional(),
    colors: z.array(z.string()).optional(),
    inStock: z.boolean().default(true),
  }),
});

const slides = defineCollection({
  type: "data",
  schema: z.object({
    order: z.number(),
    label: z.string(),
    headline: z.string(),
    subtext: z.string().optional(),
    cta: z.string(),
    href: z.string(),
    image: z.string(),
  }),
});

const articles = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    date: z.string(),
    readTime: z.number(),
    image: z.string(),
    featured: z.boolean().default(false),
    paragraphs: z.array(z.string()).optional(),
    sections: z.array(z.object({
      heading: z.string().optional(),
      body: z.string(),
    })).optional(),
  }),
});

export const collections = { products, slides, articles };
