import { Link, createFileRoute } from "@tanstack/react-router";
import { Activity, IndianRupee, Route as RouteIcon, Database } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { ExplainSimply } from "@/components/explain-simply";
import { IndiaNetwork } from "@/components/india-network";
import { KpiCard } from "@/components/kpi-card";
import { PrototypeBadges, PrototypeNotice } from "@/components/prototype-badges";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANOMALIES,
  BOOKING_WINDOWS,
  NATIONAL_FORECAST,
  NATIONAL_INDEX,
  NATIONAL_MOM,
  NATIONAL_SERIES,
  NATIONAL_YOY,
  ROUTES,
  compactNumber,
  getRoute,
  inr,
} from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AirFare Insight India — National Airfare Price Index (Prototype)" },
      {
        name: "description",
        content:
          "Simulated national airfare price index for Indian domestic routes, built as a Smart India Hackathon 2026 prototype.",
      },
      { property: "og:title", content: "AirFare Insight India — Airfare Price Index" },
      {
        property: "og:description",
        content: "SIH 2026 prototype with simulated route-level airfare index data for India.",
      },
    ],
  }),
  component: Dashboard,
});

const ZONES = ["North", "South", "East", "West", "Central", "North-East"] as const;

function Dashboard() {
  const { t } = useI18n();
  const [zone, setZone] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const [window, setWindow] = useState<string>("all");

  const filtered = useMemo(
    () =>
      ROUTES.filter(
        (r) =>
          (zone === "all" || r.origin.zone === zone || r.destination.zone === zone) &&
          (tier === "all" || String(r.origin.tier) === tier || String(r.destination.tier) === tier),
      ),
    [zone, tier],
  );

  const avgFare = filtered.length
    ? Math.round(filtered.reduce((s, r) => s + r.avgFare, 0) / filtered.length)
    : 0;

  const trend = useMemo(() => {
    const hist = NATIONAL_SERIES.map((p) => ({ ...p, forecast: undefined as number | undefined }));
    const last = hist[hist.length - 1];
    if (last) last.forecast = last.index;
    return [...hist, ...NATIONAL_FORECAST];
  }, []);

  const movers = useMemo(
    () => [...filtered].sort((a, b) => Math.abs(b.momChange) - Math.abs(a.momChange)).slice(0, 6),
    [filtered],
  );

  const zoneData = useMemo(
    () =>
      ZONES.map((z) => {
        const rs = ROUTES.filter((r) => r.origin.zone === z || r.destination.zone === z);
        const value = rs.length ? rs.reduce((s, r) => s + r.indexValue, 0) / rs.length : 0;
        return { zone: z, index: Math.round(value * 10) / 10 };
      }),
    [],
  );

  return (
    <div className="space-y-10">
      <section className="hero-gradient overflow-hidden rounded-2xl px-5 py-8 text-primary-foreground sm:px-8 sm:py-12">
        <PrototypeBadges />
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
          {t("home.headline")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/85 sm:text-base">
          {t("home.sub")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/routes">{t("common.viewAll")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link to="/methodology">{t("banner.more")}</Link>
          </Button>
        </div>
      </section>

      <PrototypeNotice />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          tone="primary"
          label={t("home.kpi.index")}
          value={NATIONAL_INDEX.toFixed(1)}
          delta={NATIONAL_MOM}
          deltaLabel={t("common.mom")}
          icon={<Activity className="size-5" aria-hidden />}
        />
        <KpiCard
          label={t("home.kpi.avgFare")}
          value={inr(avgFare)}
          delta={NATIONAL_YOY}
          deltaLabel={t("common.yoy")}
          icon={<IndianRupee className="size-5" aria-hidden />}
        />
        <KpiCard
          label={t("home.kpi.routes")}
          value={String(filtered.length)}
          icon={<RouteIcon className="size-5" aria-hidden />}
        />
        <KpiCard
          label={t("home.kpi.records")}
          value={compactNumber(1_240_000)}
          icon={<Database className="size-5" aria-hidden />}
        />
      </section>

      <section
        aria-label={t("filters.title")}
        className="rounded-xl border border-border bg-card p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-40 flex-1">
            <label htmlFor="zone" className="text-xs font-medium text-muted-foreground">
              {t("filters.zone")}
            </label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger id="zone" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                {ZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-40 flex-1">
            <label htmlFor="tier" className="text-xs font-medium text-muted-foreground">
              {t("filters.tier")}
            </label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger id="tier" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                <SelectItem value="1">Tier 1</SelectItem>
                <SelectItem value="2">Tier 2</SelectItem>
                <SelectItem value="3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-48 flex-1">
            <label htmlFor="window" className="text-xs font-medium text-muted-foreground">
              {t("filters.window")}
            </label>
            <Select value={window} onValueChange={setWindow}>
              <SelectTrigger id="window" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                {BOOKING_WINDOWS.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => toast.success(t("toast.filters"))}>{t("common.apply")}</Button>
            <Button
              variant="outline"
              onClick={() => {
                setZone("all");
                setTier("all");
                setWindow("all");
                toast(t("toast.reset"));
              }}
            >
              {t("common.reset")}
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("filters.applied")}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">{t("home.trend")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.trend.desc")}</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="idxFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="index"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#idxFill)"
                  name="Index"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  name="Forecast (demo)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <ExplainSimply text={t("home.simple")} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">{t("home.zones")}</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="zone" tick={{ fontSize: 10 }} interval={0} angle={-20} dy={8} />
                <YAxis tick={{ fontSize: 11 }} domain={[80, "dataMax + 6"]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="index" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">{t("home.cpi")}</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={NATIONAL_SERIES} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="index"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={false}
                  name="Airfare index"
                />
                <Line
                  type="monotone"
                  dataKey="cpiTransport"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  dot={false}
                  name="Transport CPI (demo)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">{t("home.movers")}</h2>
          <ul className="mt-4 divide-y divide-border">
            {movers.map((r) => (
              <li key={r.id}>
                <Link
                  to="/routes/$routeId"
                  params={{ routeId: r.id }}
                  className="flex items-center justify-between gap-3 py-3 text-sm hover:text-primary"
                >
                  <span className="min-w-0">
                    <span className="block font-medium">
                      {r.origin.city} → {r.destination.city}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {inr(r.avgFare)} · {t("common.sample")} {compactNumber(r.sampleSize)}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 tabular-nums font-semibold ${
                      r.momChange >= 0 ? "text-lotus" : "text-indiagreen"
                    }`}
                  >
                    {r.momChange > 0 ? "+" : ""}
                    {r.momChange.toFixed(1)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">{t("app.tagline")}</h2>
          <IndiaNetwork />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">{t("home.anomalies")}</h2>
          <ul className="mt-4 space-y-3">
            {ANOMALIES.map((a) => {
              const r = getRoute(a.routeId);
              return (
                <li
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <span>
                    <span className="block font-medium">
                      {r ? `${r.origin.city} → ${r.destination.city}` : a.routeId}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {a.date} · {a.reason}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                      a.severity === "high"
                        ? "bg-lotus/15 text-lotus"
                        : a.severity === "medium"
                          ? "bg-saffron/15 text-saffron"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    +{a.spikePct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
