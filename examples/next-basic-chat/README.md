# Next Basic Chat Example

This example will show the smallest production-shaped chat integration:

- client component with `useChatStream`;
- mock streaming by default;
- API route shape for real providers later;
- stop generation with `useAbortController`;
- persisted conversation with `useConversationStorage`.

The example is intentionally not wired to a real provider yet. Public demos should not spend project-owned AI credits by default.

