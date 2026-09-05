import { Link } from "@tanstack/react-router";
import { FlaskConical, Info } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function PrototypeBadges({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-saffron">
        <FlaskConical aria-hidden className="size-3.5" />
        {t("badge.prototype")}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {t("badge.demo")}
      </span>
    </div>
  );
}

export function PrototypeNotice({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <aside
      role="note"
      className={cn(
        "flex flex-wrap items-start gap-3 rounded-lg border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-foreground",
        className,
      )}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-saffron" />
      <p className="min-w-0 flex-1 leading-relaxed">
        {t("banner.text")}{" "}
        <Link to="/methodology" className="font-semibold underline underline-offset-4">
          {t("banner.more")}
        </Link>
      </p>
    </aside>
  );
}
