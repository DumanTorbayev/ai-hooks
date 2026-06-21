import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function iconProps({ size = 16, ...props }: IconProps, strokeWidth = 1.5) {
  return {
    "aria-hidden": props["aria-hidden"] ?? true,
    fill: "none",
    height: size,
    stroke: "currentColor",
    strokeWidth,
    viewBox: "0 0 16 16",
    width: size,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...iconProps(props, 1.4)}>
      <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...iconProps(props, 1.4)}>
      <circle cx="8" cy="8" r="3.2" />
      <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9L13 13M13 3l-1.1 1.1M4.1 11.9L3 13" />
    </svg>
  );
}

export function GitHubIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={props["aria-hidden"] ?? true}
      fill="currentColor"
      height={size}
      viewBox="0 0 16 16"
      width={size}
      {...props}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.32c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 17, ...props }, 1.6)} viewBox="0 0 18 18">
      <path d="M2 4.5h14M2 9h14M2 13.5h14" />
    </svg>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 17, ...props })}>
      <path d="M8 13.5s-5-3-5-7a2.7 2.7 0 0 1 5-1.4 2.7 2.7 0 0 1 5 1.4c0 4-5 7-5 7z" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 13, ...props }, 1.4)}>
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M3 11V3a1 1 0 0 1 1-1h7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 14, ...props })}>
      <path d="M3 8.5l3.5 3.5L13 4" />
    </svg>
  );
}

export function RetryIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 13, ...props }, 1.4)}>
      <path d="M13 7a5 5 0 1 1-1.6-3.7" />
      <path d="M13 2.5v4h-4" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 14, ...props })}>
      <path d="M2 8h11M8 3l5 5-5 5" />
    </svg>
  );
}

export function StopIcon({ size = 9, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={props["aria-hidden"] ?? true}
      fill="currentColor"
      height={size}
      viewBox="0 0 12 12"
      width={size}
      {...props}
    >
      <rect x="2" y="2" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function IntroIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 14, ...props }, 1.4)}>
      <path d="M3 2.5h7l3 3v8H3z" />
      <path d="M9.5 2.5V6H13" />
    </svg>
  );
}

export function CostIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 14, ...props }, 1.4)}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5v7M9.8 6.2c-.4-.5-1-.7-1.8-.7-1 0-1.7.5-1.7 1.2 0 1.7 3.5.8 3.5 2.6 0 .8-.8 1.2-1.8 1.2-.9 0-1.5-.3-1.9-.8" />
    </svg>
  );
}

export function TokensIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 14, ...props }, 1.4)}>
      <rect x="2" y="3" width="12" height="3" rx="1" />
      <rect x="2" y="9.5" width="8" height="3" rx="1" />
    </svg>
  );
}

export function ModelsIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 14, ...props }, 1.4)}>
      <rect x="2" y="2.5" width="5" height="11" rx="1" />
      <rect x="9" y="2.5" width="5" height="7" rx="1" />
    </svg>
  );
}

export function ProvidersIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 14, ...props }, 1.4)}>
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M6 6.5v7" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...iconProps({ size: 15, ...props })}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.5M8 11h.01" />
    </svg>
  );
}
