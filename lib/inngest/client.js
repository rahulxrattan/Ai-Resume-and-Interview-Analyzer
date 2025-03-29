import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "proprep", // Unique app ID
  name: "ProPrep",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
