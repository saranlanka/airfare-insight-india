import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ROUTES, inr } from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";

export function GlobalSearch() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROUTES.slice(0, 8);
    return ROUTES.filter((r) =>
      [
        r.id,
        r.origin.code,
        r.destination.code,
        r.origin.city,
        r.destination.city,
        r.origin.state,
        r.destination.state,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    ).slice(0, 10);
  }, [query]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label={t("search.label")}
      >
        <Search aria-hidden className="size-4" />
        <span className="hidden lg:inline">{t("search.label")}</span>
        <kbd className="hidden rounded border border-border px-1 text-[10px] lg:inline">Ctrl K</kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("search.label")}</DialogTitle>
            <DialogDescription>{t("search.hint")}</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
          />
          <ul className="max-h-72 overflow-y-auto" aria-live="polite">
            {results.length === 0 ? (
              <li className="px-1 py-6 text-center text-sm text-muted-foreground">
                {t("search.empty")}
              </li>
            ) : (
              results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      void navigate({ to: "/routes/$routeId", params: { routeId: r.id } });
                    }}
                  >
                    <span className="font-medium">
                      {r.origin.city} → {r.destination.city}
                      <span className="ml-2 text-xs text-muted-foreground">{r.id}</span>
                    </span>
                    <span className="tabular-nums text-muted-foreground">{inr(r.avgFare)}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
