// ---------------------------------------------------------------------------
// SIMULATED DEMO DATA ONLY.
// Nothing here is scraped, purchased or sourced from any airline, OTA, DGCA or
// MoSPI system. Every number below is deterministically generated for the
// purposes of a Smart India Hackathon 2026 prototype demonstration.
// ---------------------------------------------------------------------------

export const PROTOTYPE_NOTICE_ID = "sih-2026-26056";

/** Deterministic pseudo-random generator so charts are stable across renders. */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function hashString(value: string) {
  let h = 7;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) % 2147483647;
  return h;
}

export type Airport = {
  code: string;
  city: string;
  state: string;
  zone: "North" | "South" | "East" | "West" | "Central" | "North-East";
  tier: 1 | 2 | 3;
};

export const AIRPORTS: Airport[] = [
  { code: "DEL", city: "Delhi", state: "Delhi", zone: "North", tier: 1 },
  { code: "BOM", city: "Mumbai", state: "Maharashtra", zone: "West", tier: 1 },
  { code: "BLR", city: "Bengaluru", state: "Karnataka", zone: "South", tier: 1 },
  { code: "HYD", city: "Hyderabad", state: "Telangana", zone: "South", tier: 1 },
  { code: "MAA", city: "Chennai", state: "Tamil Nadu", zone: "South", tier: 1 },
  { code: "CCU", city: "Kolkata", state: "West Bengal", zone: "East", tier: 1 },
  { code: "PNQ", city: "Pune", state: "Maharashtra", zone: "West", tier: 2 },
  { code: "AMD", city: "Ahmedabad", state: "Gujarat", zone: "West", tier: 2 },
  { code: "COK", city: "Kochi", state: "Kerala", zone: "South", tier: 2 },
  { code: "GOI", city: "Goa", state: "Goa", zone: "West", tier: 2 },
  { code: "JAI", city: "Jaipur", state: "Rajasthan", zone: "North", tier: 2 },
  { code: "LKO", city: "Lucknow", state: "Uttar Pradesh", zone: "North", tier: 2 },
  { code: "PAT", city: "Patna", state: "Bihar", zone: "East", tier: 2 },
  { code: "GAU", city: "Guwahati", state: "Assam", zone: "North-East", tier: 2 },
  { code: "IXC", city: "Chandigarh", state: "Punjab", zone: "North", tier: 2 },
  { code: "BBI", city: "Bhubaneswar", state: "Odisha", zone: "East", tier: 2 },
  { code: "NAG", city: "Nagpur", state: "Maharashtra", zone: "Central", tier: 2 },
  { code: "SXR", city: "Srinagar", state: "Jammu & Kashmir", zone: "North", tier: 3 },
  { code: "IXB", city: "Bagdogra", state: "West Bengal", zone: "East", tier: 3 },
  { code: "VNS", city: "Varanasi", state: "Uttar Pradesh", zone: "North", tier: 3 },
];

export const CARRIERS = [
  "IndiGo (demo)",
  "Air India (demo)",
  "Vistara-Legacy (demo)",
  "Akasa (demo)",
  "SpiceJet (demo)",
] as const;

export type Cabin = "economy" | "premium" | "business";
export type BookingWindow = "0-3" | "4-7" | "8-14" | "15-30" | "31-60" | "60+";

export const BOOKING_WINDOWS: BookingWindow[] = ["0-3", "4-7", "8-14", "15-30", "31-60", "60+"];

export type RouteRecord = {
  id: string;
  origin: Airport;
  destination: Airport;
  distanceKm: number;
  weeklyFlights: number;
  avgFare: number;
  indexValue: number;
  momChange: number;
  yoyChange: number;
  volatility: number;
  sampleSize: number;
  confidence: "high" | "medium" | "low";
};

const PAIRS: [string, string, number][] = [
  ["DEL", "BOM", 1148],
  ["DEL", "BLR", 1740],
  ["BOM", "BLR", 842],
  ["DEL", "HYD", 1264],
  ["BOM", "DEL", 1148],
  ["DEL", "CCU", 1305],
  ["BLR", "HYD", 500],
  ["MAA", "BLR", 290],
  ["BOM", "GOI", 425],
  ["DEL", "SXR", 640],
  ["HYD", "MAA", 520],
  ["CCU", "GAU", 520],
  ["DEL", "PAT", 850],
  ["BOM", "AMD", 440],
  ["DEL", "JAI", 240],
  ["BLR", "COK", 360],
  ["DEL", "LKO", 420],
  ["BOM", "PNQ", 120],
  ["CCU", "BBI", 380],
  ["DEL", "IXC", 240],
  ["BOM", "MAA", 1030],
  ["BLR", "CCU", 1560],
  ["DEL", "GAU", 1690],
  ["HYD", "GOI", 560],
  ["DEL", "VNS", 690],
  ["CCU", "IXB", 430],
  ["BOM", "NAG", 640],
  ["MAA", "COK", 500],
  ["BLR", "PNQ", 730],
  ["HYD", "CCU", 1180],
];

const byCode = (code: string) => AIRPORTS.find((a) => a.code === code)!;

export const ROUTES: RouteRecord[] = PAIRS.map(([o, d, km]) => {
  const id = `${o}-${d}`;
  const rnd = seeded(hashString(id));
  const base = 2100 + km * 2.35 + rnd() * 1800;
  const tierAdj = byCode(o).tier === 1 && byCode(d).tier === 1 ? 1 : 1.08;
  const avgFare = Math.round((base * tierAdj) / 10) * 10;
  const indexValue = Math.round((92 + rnd() * 38) * 10) / 10;
  const sampleSize = Math.round(4200 + rnd() * 26000);
  return {
    id,
    origin: byCode(o),
    destination: byCode(d),
    distanceKm: km,
    weeklyFlights: Math.round(18 + rnd() * 160),
    avgFare,
    indexValue,
    momChange: Math.round((rnd() * 18 - 7) * 10) / 10,
    yoyChange: Math.round((rnd() * 30 - 9) * 10) / 10,
    volatility: Math.round((6 + rnd() * 26) * 10) / 10,
    sampleSize,
    confidence: sampleSize > 20000 ? "high" : sampleSize > 10000 ? "medium" : "low",
  };
});

export function getRoute(id: string) {
  return ROUTES.find((r) => r.id === id);
}

export type SeriesPoint = {
  label: string;
  index: number;
  fare: number;
  cpiTransport: number;
  forecast?: number;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Seasonality: summer + festive + winter-wedding demand peaks (simulated). */
const SEASONALITY = [4, -2, -3, 2, 9, 7, 1, -2, -4, 8, 11, 14];

export function buildSeries(seedKey: string, months = 24, baseFare = 5200): SeriesPoint[] {
  const rnd = seeded(hashString(seedKey));
  const out: SeriesPoint[] = [];
  let idx = 100;
  for (let i = 0; i < months; i++) {
    const m = (i + 1) % 12;
    const drift = 0.35 + rnd() * 0.5;
    const season = SEASONALITY[m] * 0.45;
    idx = Math.max(72, idx + drift + season * 0.35 + (rnd() - 0.5) * 3.4);
    out.push({
      label: `${MONTHS[m]} ${25 + Math.floor((i + 1) / 12)}`,
      index: Math.round(idx * 10) / 10,
      fare: Math.round((baseFare * idx) / 100 / 10) * 10,
      cpiTransport: Math.round((100 + i * 0.42 + (rnd() - 0.5) * 1.1) * 10) / 10,
    });
  }
  return out;
}

export function buildForecast(series: SeriesPoint[], horizon = 6): SeriesPoint[] {
  const rnd = seeded(hashString(series.map((s) => s.index).join("|")));
  const last = series[series.length - 1];
  const slope =
    (series[series.length - 1].index - series[series.length - 7].index) / 6 || 0.4;
  const out: SeriesPoint[] = [];
  let idx = last.index;
  for (let i = 1; i <= horizon; i++) {
    const m = (series.length + i) % 12;
    idx = idx + slope * 0.8 + SEASONALITY[m] * 0.22 + (rnd() - 0.5) * 1.2;
    out.push({
      label: `${MONTHS[m]} ${25 + Math.floor((series.length + i) / 12)}`,
      index: Math.round(idx * 10) / 10,
      forecast: Math.round(idx * 10) / 10,
      fare: Math.round((last.fare * idx) / last.index / 10) * 10,
      cpiTransport: last.cpiTransport,
    });
  }
  return out;
}

export function bookingCurve(routeId: string, avgFare: number) {
  const rnd = seeded(hashString(routeId + "bw"));
  const multipliers: Record<BookingWindow, number> = {
    "0-3": 2.35,
    "4-7": 1.72,
    "8-14": 1.31,
    "15-30": 1.05,
    "31-60": 0.92,
    "60+": 0.88,
  };
  return BOOKING_WINDOWS.map((w) => ({
    window: w,
    fare: Math.round(((avgFare * multipliers[w]) / 10) * 10 * (0.95 + rnd() * 0.1)),
    share: Math.round((5 + rnd() * 28) * 10) / 10,
  }));
}

export function carrierSpread(routeId: string, avgFare: number) {
  const rnd = seeded(hashString(routeId + "car"));
  return CARRIERS.map((c) => {
    const f = Math.round((avgFare * (0.82 + rnd() * 0.42)) / 10) * 10;
    return {
      carrier: c,
      fare: f,
      seatShare: Math.round((8 + rnd() * 30) * 10) / 10,
      onTime: Math.round(72 + rnd() * 24),
    };
  });
}

export function cabinSpread(avgFare: number): { cabin: Cabin; fare: number }[] {
  return [
    { cabin: "economy", fare: avgFare },
    { cabin: "premium", fare: Math.round((avgFare * 1.85) / 10) * 10 },
    { cabin: "business", fare: Math.round((avgFare * 3.4) / 10) * 10 },
  ];
}

export const NATIONAL_SERIES = buildSeries("national-index", 24, 5400);
export const NATIONAL_FORECAST = buildForecast(NATIONAL_SERIES, 6);

export const NATIONAL_INDEX = NATIONAL_SERIES[NATIONAL_SERIES.length - 1].index;
export const NATIONAL_MOM =
  Math.round(
    (NATIONAL_INDEX - NATIONAL_SERIES[NATIONAL_SERIES.length - 2].index) * 10,
  ) / 10;
export const NATIONAL_YOY =
  Math.round((NATIONAL_INDEX - NATIONAL_SERIES[NATIONAL_SERIES.length - 13].index) * 10) /
  10;

export type Anomaly = {
  id: string;
  routeId: string;
  date: string;
  spikePct: number;
  reason: string;
  severity: "high" | "medium" | "low";
};

export const ANOMALIES: Anomaly[] = [
  {
    id: "a1",
    routeId: "DEL-SXR",
    date: "2026-08-14",
    spikePct: 168,
    reason: "demand.surge.holiday",
    severity: "high",
  },
  {
    id: "a2",
    routeId: "CCU-GAU",
    date: "2026-08-22",
    spikePct: 94,
    reason: "capacity.cut",
    severity: "high",
  },
  {
    id: "a3",
    routeId: "BOM-GOI",
    date: "2026-08-29",
    spikePct: 61,
    reason: "weekend.leisure.peak",
    severity: "medium",
  },
  {
    id: "a4",
    routeId: "DEL-PAT",
    date: "2026-09-01",
    spikePct: 44,
    reason: "festival.window",
    severity: "medium",
  },
  {
    id: "a5",
    routeId: "MAA-COK",
    date: "2026-09-03",
    spikePct: 22,
    reason: "sampling.thin",
    severity: "low",
  },
];

export type PipelineStage = {
  id: string;
  key: string;
  recordsPerRun: number;
  latencySec: number;
  health: "ok" | "warn";
};

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "ingest", key: "pipeline.stage.ingest", recordsPerRun: 1_240_000, latencySec: 92, health: "ok" },
  { id: "validate", key: "pipeline.stage.validate", recordsPerRun: 1_216_400, latencySec: 41, health: "ok" },
  { id: "normalise", key: "pipeline.stage.normalise", recordsPerRun: 1_201_900, latencySec: 55, health: "ok" },
  { id: "weight", key: "pipeline.stage.weight", recordsPerRun: 1_198_300, latencySec: 33, health: "warn" },
  { id: "index", key: "pipeline.stage.index", recordsPerRun: 4_820, latencySec: 12, health: "ok" },
  { id: "publish", key: "pipeline.stage.publish", recordsPerRun: 4_820, latencySec: 6, health: "ok" },
];

export function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}
