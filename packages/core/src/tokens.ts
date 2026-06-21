export type EstimateTokensInput = {
  text: string;
  charsPerToken?: number;
};

export function estimateTokens(input: EstimateTokensInput): number {
  const trimmed = input.text.trim();

  if (!trimmed) {
    return 0;
  }

  const charsPerToken = input.charsPerToken ?? 4;

  return Math.ceil(trimmed.length / charsPerToken);
}
