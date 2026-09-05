import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ExplainSimply } from "@/components/explain-simply";
import { PrototypeNotice } from "@/components/prototype-badges";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES, compactNumber, inr } from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/routes/")({
  head: () => ({
    meta: [
      { title: "Route Explorer — AirFare Insight India (Prototype)" },
      {
        name: "description",
        content: "Browse simulated route-level airfare index values, fares and volatility.",
      },
      { property: "og:title", content: "Route Explorer — AirFare Insight India" },
      {
        property: "og:description",
        content: "Simulated route-level airfare index data for Indian domestic routes.",
      },
    ],
  }),
  component: RoutesPage,
});

function RoutesPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("index");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = ROUTES.filter((r) =>
      [r.id, r.origin.city, r.destination.city].join(" ").toLowerCase().includes(query),
    );
    return [...filtered].sort((a, b) => {
      if (sort === "fare") return b.avgFare - a.avgFare;
      if (sort === "mom") return b.momChange - a.momChange;
      if (sort === "vol") return b.volatility - a.volatility;
      return b.indexValue - a.indexValue;
    });
  }, [q, sort]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold">{t("routes.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("routes.sub")}</p>
      </header>

      <PrototypeNotice />

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-56 flex-1">
          <label htmlFor="route-q" className="text-xs font-medium text-muted-foreground">
            {t("search.label")}
          </label>
          <Input
            id="route-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="mt-1"
          />
        </div>
        <div className="min-w-44">
          <label htmlFor="route-sort" className="text-xs font-medium text-muted-foreground">
            {t("routes.sort")}
          </label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="route-sort" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index">{t("routes.col.index")}</SelectItem>
              <SelectItem value="fare">{t("routes.col.fare")}</SelectItem>
              <SelectItem value="mom">{t("routes.col.mom")}</SelectItem>
              <SelectItem value="vol">{t("routes.col.vol")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="pb-2 text-sm text-muted-foreground" aria-live="polite">
          {rows.length} {t("routes.count")}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t("search.empty")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">{t("routes.title")}</caption>
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">
                  {t("routes.col.route")}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {t("routes.col.fare")}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {t("routes.col.index")}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {t("routes.col.mom")}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {t("routes.col.vol")}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {t("common.sample")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/60">
                  <td className="px-4 py-3">
                    <Link
                      to="/routes/$routeId"
                      params={{ routeId: r.id }}
                      className="font-medium hover:text-primary"
                    >
                      {r.origin.city} → {r.destination.city}
                      <span className="ml-2 text-xs text-muted-foreground">{r.id}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{inr(r.avgFare)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.indexValue.toFixed(1)}</td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-medium ${
                      r.momChange >= 0 ? "text-lotus" : "text-indiagreen"
                    }`}
                  >
                    {r.momChange > 0 ? "+" : ""}
                    {r.momChange.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.volatility.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {compactNumber(r.sampleSize)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ExplainSimply text={t("home.simple")} />
    </div>
  );
}
