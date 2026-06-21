export type MockStreamOptions = {
  text: string;
  chunkSize?: number;
  delayMs?: number;
};

export async function* createMockTextStream(options: MockStreamOptions) {
  const chunkSize = options.chunkSize ?? 8;
  const delayMs = options.delayMs ?? 24;

  for (let index = 0; index < options.text.length; index += chunkSize) {
    await wait(delayMs);
    yield options.text.slice(index, index + chunkSize);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
