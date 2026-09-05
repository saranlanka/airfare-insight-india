import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ROUTES, type RouteRecord } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

// Approximate geographic coordinates used only to place decorative nodes.
const COORDS: Record<string, [number, number]> = {
  DEL: [77.1, 28.6],
  BOM: [72.87, 19.09],
  BLR: [77.7, 13.2],
  HYD: [78.43, 17.24],
  MAA: [80.17, 12.99],
  CCU: [88.44, 22.65],
  PNQ: [73.92, 18.58],
  AMD: [72.63, 23.07],
  COK: [76.4, 10.15],
  GOI: [73.83, 15.38],
  JAI: [75.81, 26.82],
  LKO: [80.89, 26.76],
  PAT: [85.09, 25.59],
  GAU: [91.59, 26.11],
  IXC: [76.79, 30.67],
  BBI: [85.82, 20.24],
  NAG: [79.05, 21.09],
  SXR: [74.77, 33.99],
  IXB: [88.33, 26.68],
  VNS: [82.86, 25.45],
};

const W = 620;
const H = 700;
const LON = [68, 97.5] as const;
const LAT = [7, 36] as const;

function project(code: string): { x: number; y: number } | null {
  const c = COORDS[code];
  if (!c) return null;
  const x = ((c[0] - LON[0]) / (LON[1] - LON[0])) * W;
  const y = H - ((c[1] - LAT[0]) / (LAT[1] - LAT[0])) * H;
  return { x, y };
}

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const lift = Math.min(90, len * 0.22);
  const cx = mx - (dy / len) * lift;
  const cy = my + (dx / len) * lift;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export function IndiaNetwork({ routes = ROUTES.slice(0, 16) }: { routes?: RouteRecord[] }) {
  const [active, setActive] = useState<string | null>(null);

  const arcs = useMemo(
    () =>
      routes
        .map((r) => {
          const a = project(r.origin.code);
          const b = project(r.destination.code);
          if (!a || !b) return null;
          return { route: r, d: arcPath(a, b) };
        })
        .filter((v): v is { route: RouteRecord; d: string } => v !== null),
    [routes],
  );

  const nodes = useMemo(() => {
    const set = new Map<string, { x: number; y: number; city: string; weight: number }>();
    for (const r of routes) {
      for (const ap of [r.origin, r.destination]) {
        const p = project(ap.code);
        if (!p) continue;
        const prev = set.get(ap.code);
        set.set(ap.code, {
          ...p,
          city: ap.city,
          weight: (prev?.weight ?? 0) + 1,
        });
      }
    }
    return [...set.entries()];
  }, [routes]);

  const activeRoute = arcs.find((a) => a.route.id === active)?.route;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[380px] w-full sm:h-[520px]"
        role="img"
        aria-label="Stylised network diagram of simulated Indian domestic air routes"
      >
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-saffron)" />
            <stop offset="100%" stopColor="var(--color-indiagreen)" />
          </linearGradient>
        </defs>
        {arcs.map(({ route, d }) => {
          const isActive = active === route.id;
          return (
            <g key={route.id}>
              <path
                d={d}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth={isActive ? 2.6 : 1.1}
                strokeOpacity={active && !isActive ? 0.18 : 0.75}
                strokeLinecap="round"
              />
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
                onMouseEnter={() => setActive(route.id)}
                onMouseLeave={() => setActive(null)}
              />
            </g>
          );
        })}
        {nodes.map(([code, n]) => (
          <g key={code}>
            <circle
              cx={n.x}
              cy={n.y}
              r={3 + Math.min(4, n.weight)}
              className="fill-primary"
              fillOpacity={0.85}
            />
            <circle cx={n.x} cy={n.y} r={2} className="fill-background" />
            <text
              x={n.x + 9}
              y={n.y + 4}
              className="fill-muted-foreground text-[11px]"
              style={{ fontSize: 11 }}
            >
              {code}
            </text>
          </g>
        ))}
      </svg>

      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none absolute left-3 top-3 rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-sm transition-opacity",
          activeRoute ? "opacity-100" : "opacity-0",
        )}
      >
        {activeRoute ? (
          <span className="font-medium">
            {activeRoute.origin.city} → {activeRoute.destination.city} · index{" "}
            {activeRoute.indexValue.toFixed(1)}
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {routes.slice(0, 8).map((r) => (
          <li key={r.id}>
            <Link
              to="/routes/$routeId"
              params={{ routeId: r.id }}
              className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary"
              onMouseEnter={() => setActive(r.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(r.id)}
              onBlur={() => setActive(null)}
            >
              {r.origin.code}–{r.destination.code}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
