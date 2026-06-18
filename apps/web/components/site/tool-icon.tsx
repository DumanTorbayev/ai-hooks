import { CostIcon, ModelsIcon, ProvidersIcon, TokensIcon } from "@/components/icons";

import type { PlanningToolId } from "@/content/tools";

type PlanningToolIconProps = {
  id: PlanningToolId;
  size?: number;
};

export function PlanningToolIcon({ id, size = 15 }: PlanningToolIconProps) {
  const icons = {
    cost: CostIcon,
    models: ModelsIcon,
    providers: ProvidersIcon,
    tokens: TokensIcon,
  } satisfies Record<PlanningToolId, typeof CostIcon>;
  const Icon = icons[id];

  return <Icon size={size} />;
}
