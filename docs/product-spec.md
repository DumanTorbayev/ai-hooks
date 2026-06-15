# Product Spec

## Название

Рабочее название: **AI Hooks**.

Возможные домены/бренды:

- `useaihooks.com`
- `aihooks.dev`
- `useai.dev`
- `aiui.dev`
- `aiuikit.dev`

Позиционирование:

> React hooks and UI patterns for production AI apps.

## Цель

Собрать большую developer-аудиторию вокруг бесплатного набора инструментов для создания AI-интерфейсов. Монетизация идет через рекламу, спонсорские интеграции и newsletter sponsorships, а не через продажу курсов или платный доступ.

## Для кого

Основная аудитория:

- React/Next.js разработчики;
- indie hackers, которые строят AI SaaS;
- команды, внедряющие AI chat/support/copilot в продукт;
- frontend/full-stack разработчики, которым нужны готовые UI primitives;
- разработчики, которые ищут практические решения для streaming, tool calls, token usage, file upload, voice input.

## Главная проблема

AI SDK и API-провайдеры дают низкоуровневые примеры, но разработчику все равно нужно собрать:

- нормальный streaming UI;
- отмену генерации;
- хранение истории;
- учет токенов и стоимости;
- file upload;
- tool calling lifecycle;
- обработку ошибок;
- совместимость моделей;
- понятные UI patterns.

Проект закрывает этот слой.

## Что входит в MVP

### React hooks

- `useChatStream`
- `useAbortController`
- `useConversationStorage`
- `useTokenUsage`
- `useModelCost`
- `useFileUpload`
- `useToolCalls`

Опционально для второй волны:

- `useVoiceInput`
- `useCitations`
- `useRateLimitBackoff`
- `usePromptHistory`
- `useMessageFeedback`

### Tools

- LLM cost calculator
- Token estimator
- Model comparison table
- Streaming playground
- Provider compatibility matrix

### Examples gallery

- Basic AI chat
- Chat with file upload
- Chat with tool calls
- Chat with citations
- Support bot UI
- Command palette AI assistant
- Sidebar copilot

## Что не делаем в MVP

- Не строим hosted AI API.
- Не оплачиваем пользовательские AI-запросы.
- Не делаем paywall.
- Не делаем курс.
- Не делаем сложный visual builder.
- Не пытаемся поддержать 20 провайдеров сразу.

## Ключевое продуктовое решение

Публичные демо должны работать без расходов на AI:

- mock streaming по умолчанию;
- "bring your own key" как optional режим;
- реальные server demos только позже, с лимитами.

## Почему это может набрать аудиторию

Обычный текстовый контент хуже работает в эпоху AI, потому что LLM может пересказать статью. Но интерактивные инструменты и рабочие демо остаются полезными:

- разработчик копирует код;
- проверяет поведение streaming;
- считает стоимость модели;
- сравнивает провайдеров;
- возвращается к compatibility table.

## Основная метрика

До монетизации:

- monthly pageviews;
- returning visitors;
- GitHub stars;
- npm downloads;
- newsletter subscribers;
- copied code snippets;
- demo interactions.

После монетизации:

- ad impressions;
- sponsor CTR;
- newsletter open rate;
- sponsor revenue per month;
- direct sponsor pipeline.

