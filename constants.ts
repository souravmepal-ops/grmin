import { ModelId } from "./types";

export const INITIAL_SUGGESTIONS = [
  "Explain quantum computing to a 5-year-old",
  "Write a haiku about TypeScript",
  "Debug a React useEffect infinite loop",
  "Plan a 3-day trip to Tokyo"
];

export const MODELS = [
  { id: ModelId.FLASH, name: "Gemini 2.5 Flash", description: "Fast & Efficient" },
  { id: ModelId.PRO, name: "Gemini 3.0 Pro", description: "Complex Reasoning" },
];