export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { prompt?: string };
  const prompt = body.prompt?.trim() || "your message";
  const encoder = new TextEncoder();
  const parts = [
    "This mock route received: ",
    `"${prompt}". `,
    "Replace this handler with your provider call, keep API keys on the server, ",
    "and stream plain text deltas back to useChatStream.",
  ];

  const stream = new ReadableStream({
    async start(controller) {
      for (const part of parts) {
        controller.enqueue(encoder.encode(part));
        await wait(120);
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
