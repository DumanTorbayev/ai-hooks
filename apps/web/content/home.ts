export const hooks = [
  {
    name: "useChatStream",
    status: "ready",
    description: "Stream tokens into your own chat UI with stop, retry, and usage callbacks.",
    returns: ["messages", "send()", "isStreaming", "stop()"],
  },
  {
    name: "useAbortController",
    status: "ready",
    description: "Wire stop-generation behavior into fetch streams and provider requests.",
    returns: ["signal", "abort()", "reset()"],
  },
  {
    name: "useConversationStorage",
    status: "ready",
    description: "Persist thread state locally while keeping the message shape portable.",
    returns: ["messages", "add()", "append()", "clear()"],
  },
  {
    name: "useTokenUsage",
    status: "ready",
    description: "Keep token usage visible as product state instead of hidden provider metadata.",
    returns: ["input", "output", "total", "add()"],
  },
  {
    name: "useFileUpload",
    status: "beta",
    description: "Validate files before they enter an AI workflow or upload route.",
    returns: ["files", "addFiles()", "errors", "remove()"],
  },
  {
    name: "useToolCalls",
    status: "beta",
    description: "Track tool call lifecycle for agent timelines and debug panels.",
    returns: ["calls", "run()", "schema", "status"],
  },
] as const;

export const patterns = [
  {
    title: "Streaming chat",
    tag: "useChatStream",
    preview: "stream",
    description: "Append deltas into your existing message component.",
  },
  {
    title: "Stop generation",
    tag: "useAbortController",
    preview: "stop",
    description: "Expose a real abort state instead of a fake disabled button.",
  },
  {
    title: "Tool call timeline",
    tag: "useToolCalls",
    preview: "timeline",
    description: "Show agent steps as they run, complete, or fail.",
  },
  {
    title: "File upload chat",
    tag: "useFileUpload",
    preview: "file",
    description: "Handle PDFs, images, and text before sending metadata.",
  },
  {
    title: "Voice input",
    tag: "useVoiceInput",
    preview: "voice",
    description: "Capture speech and turn it into composer text.",
  },
  {
    title: "Citations layout",
    tag: "useCitations",
    preview: "cite",
    description: "Render answer text with grounded source references.",
  },
] as const;

export type PatternPreviewType = (typeof patterns)[number]["preview"];
