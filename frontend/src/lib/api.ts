export type PredictResponse = {
  ok: boolean;
  error?: string;
  user_text_preview?: string;
  preprocessed?: string;
  emotions?: Record<string, number>;
  dominant_emotion?: string | null;
  sentiment?: {
    label: string;
    compound: number;
    positive: number;
    neutral: number;
    negative: number;
  };
  models?: Record<string, string>;
  threat_final?: string;
  source_url?: string | null;
};

export async function predict(text: string, url: string): Promise<PredictResponse> {
  const res = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text.trim(), url: url.trim() }),
  });
  const data = (await res.json()) as PredictResponse;
  if (!res.ok && data.error) return { ok: false, error: data.error };
  return data;
}
