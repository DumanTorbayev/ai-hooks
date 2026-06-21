function getPublicHttpsUrl(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

const defaultSupportUrl = "https://opencollective.com/ai-hooks";

export const siteConfig = {
  supportUrl: getPublicHttpsUrl(process.env.NEXT_PUBLIC_SUPPORT_URL) ?? defaultSupportUrl,
};
