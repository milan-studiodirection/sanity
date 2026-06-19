import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-06-16",
  useCdn: false,
  stega: {
    enabled: true,
    studioUrl: "http://localhost:3333",
  },
});
