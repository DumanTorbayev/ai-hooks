import { Binary, Calculator, GitCompareArrows, Table2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { PlanningToolId } from "@/content/tools";

type PlanningToolIconProps = {
  id: PlanningToolId;
  size?: number;
};

export function PlanningToolIcon({ id, size = 15 }: PlanningToolIconProps) {
  const icons = {
    cost: Calculator,
    models: GitCompareArrows,
    providers: Table2,
    tokens: Binary,
  } satisfies Record<PlanningToolId, LucideIcon>;
  const Icon = icons[id];

  return <Icon aria-hidden="true" size={size} strokeWidth={1.8} />;
}
