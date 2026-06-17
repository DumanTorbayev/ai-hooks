import { siteConfig } from "@/content/site";

type SupportButtonProps = {
  className?: string;
};

export function SupportButton({ className }: SupportButtonProps) {
  if (!siteConfig.supportUrl) {
    return null;
  }

  return (
    <a className={className} href={siteConfig.supportUrl} rel="noreferrer" target="_blank">
      Buy me a coffee
    </a>
  );
}
