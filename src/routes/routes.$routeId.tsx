import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import {
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

import { ExplainSimply } from "@/components/explain-simply";
import { KpiCard } from "@/components/kpi-card";
import { PrototypeNotice } from "@/components/prototype-badges";
import { Button } from "@/components/ui/button";
import {
  bookingCurve,
  buildSeries,
  cabinSpread,
  carrierSpread,
  compactNumber,
  getRoute,
  inr,
} from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/routes/$routeId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.routeId} route index — AirFare Insight India (Prototype)` },
      {
        name: "description",
        content: `Simulated airfare index, booking-window curve and carrier spread for route ${params.routeId}.`,
      },
      { property: "og:title", content: `${params.routeId} — AirFare Insight India` },
      {
        property: "og:description",
        content: "Route-level simulated airfare index detail from the SIH 2026 prototype.",
      },
    ],
  }),
  component: RouteDetail,
});

function RouteDetail() {
  const { routeId } = Route.useParams();
  const { t } = useI18n();
  const route = getRoute(routeId);

  const series = useMemo(
    () => (route ? buildSeries(route.id, 24, route.avgFare) : []),
    [route],
  );
  const booking = useMemo(
    () => (route ? bookingCurve(route.id, route.avgFare) : []),
    [route],
  );
  const carriers = useMemo(
    () => (route ? carrierSpread(route.id, route.avgFare) : []),
    [route],
  );

  if (!route) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">{t("route.notFound")}</h1>
        <Button asChild className="mt-6">
          <Link to="/routes">{t("route.back")}</Link>
        </Button>
      </div>
    );
  }

  const cabins = cabinSpread(route.avgFare);

  return (
    <div className="space-y-6">
      <Link
        to="/routes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {t("route.back")}
      </Link>

      <header>
        <h1 className="font-display text-3xl font-semibold">
          {route.origin.city} → {route.destination.city}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {route.id} · {t("route.distance")}: {route.distanceKm} km · {route.weeklyFlights}{" "}
          {t("routes.col.flights").toLowerCase()}
        </p>
      </header>

      <PrototypeNotice />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          tone="primary"
          label={t("routes.col.index")}
          value={route.indexValue.toFixed(1)}
          delta={route.momChange}
          deltaLabel={t("common.mom")}
        />
        <KpiCard label={t("routes.col.fare")} value={inr(route.avgFare)} delta={route.yoyChange} deltaLabel={t("common.yoy")} />
        <KpiCard label={t("routes.col.vol")} value={`${route.volatility.toFixed(1)}%`} />
        <KpiCard
          label={t("common.sample")}
          value={compactNumber(route.sampleSize)}
          icon={
            <span className="text-xs font-semibold uppercase">
              {t(
                route.confidence === "high"
                  ? "common.high"
                  : route.confidence === "medium"
                    ? "common.medium"
                    : "common.low",
              )}
            </span>
          }
        />
      </section>

      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold">{t("route.trend")}</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ left: -18, right: 8, top: 8 }}>
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
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ExplainSimply text={t("home.simple")} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">{t("route.booking")}</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={booking} margin={{ left: -6, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="window" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => inr(v)}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="fare" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">{t("route.carriers")}</h2>
          <ul className="mt-4 divide-y divide-border text-sm">
            {carriers.map((c) => (
              <li key={c.carrier} className="flex items-center justify-between gap-3 py-3">
                <span>
                  <span className="block font-medium">{c.carrier}</span>
                  <span className="block text-xs text-muted-foreground">
                    seat share {c.seatShare}% · on-time {c.onTime}%
                  </span>
                </span>
                <span className="tabular-nums font-semibold">{inr(c.fare)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold">{t("route.cabins")}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {cabins.map((c) => (
            <li key={c.cabin} className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.cabin}</p>
              <p className="mt-1 font-display text-xl font-semibold tabular-nums">{inr(c.fare)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
