import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon?: ReactNode;
  tone?: "default" | "primary";
}) {
  const direction = delta === undefined ? "flat" : delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat";
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        tone === "primary"
          ? "border-primary/25 bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wide",
            tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {icon ? (
          <span className={tone === "primary" ? "text-saffron" : "text-muted-foreground"}>{icon}</span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold tabular-nums sm:text-3xl">{value}</p>
      {delta !== undefined ? (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            tone === "primary"
              ? "text-primary-foreground/85"
              : direction === "up"
                ? "text-lotus"
                : direction === "down"
                  ? "text-indiagreen"
                  : "text-muted-foreground",
          )}
        >
          <Icon aria-hidden className="size-3.5" />
          <span className="tabular-nums">
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          {deltaLabel ? <span className="font-normal">{deltaLabel}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
