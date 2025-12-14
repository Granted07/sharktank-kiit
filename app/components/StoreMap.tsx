"use client";

type Highlight = {
  zone?: string | null;
  aisle?: string | null;
  shelf?: string | null;
};

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ZoneDefinition = {
  name: string;
  color: string;
  bounds: Bounds;
  aisles: string[];
};

type AisleDefinition = {
  label: string;
  zone: string;
  bounds: Bounds;
};

type ShelfDefinition = {
  code: string;
  aisle: string;
  position: { x: number; y: number };
};

const ZONES: ZoneDefinition[] = [
  {
    name: "Snacks",
    color: "rgba(34, 211, 238, 0.08)",
    bounds: { x: 6, y: 10, width: 28, height: 48 },
    aisles: ["S1", "S2"],
  },
  {
    name: "Beverages",
    color: "rgba(14, 165, 233, 0.08)",
    bounds: { x: 38, y: 10, width: 26, height: 48 },
    aisles: ["B1", "B2"],
  },
  {
    name: "Dairy",
    color: "rgba(99, 102, 241, 0.08)",
    bounds: { x: 68, y: 10, width: 24, height: 48 },
    aisles: ["D1"],
  },
];

const AISLES: AisleDefinition[] = [
  { label: "S1", zone: "Snacks", bounds: { x: 12, y: 12, width: 4, height: 44 } },
  { label: "S2", zone: "Snacks", bounds: { x: 24, y: 12, width: 4, height: 44 } },
  { label: "B1", zone: "Beverages", bounds: { x: 44, y: 12, width: 4, height: 44 } },
  { label: "B2", zone: "Beverages", bounds: { x: 56, y: 12, width: 4, height: 44 } },
  { label: "D1", zone: "Dairy", bounds: { x: 74, y: 12, width: 4, height: 44 } },
];

const SHELVES: ShelfDefinition[] = [
  { code: "S1-L1", aisle: "S1", position: { x: 10.5, y: 18 } },
  { code: "S1-L2", aisle: "S1", position: { x: 10.5, y: 34 } },
  { code: "S2-R1", aisle: "S2", position: { x: 28.5, y: 20 } },
  { code: "S2-R2", aisle: "S2", position: { x: 28.5, y: 36 } },
  { code: "B1-L1", aisle: "B1", position: { x: 42.5, y: 18 } },
  { code: "B1-L2", aisle: "B1", position: { x: 42.5, y: 34 } },
  { code: "B2-R1", aisle: "B2", position: { x: 60.5, y: 18 } },
  { code: "B2-R2", aisle: "B2", position: { x: 60.5, y: 34 } },
  { code: "D1-L1", aisle: "D1", position: { x: 72.5, y: 18 } },
  { code: "D1-L2", aisle: "D1", position: { x: 72.5, y: 34 } },
];

const ENTRANCE = { x: 10, y: 62 };
const EXIT = { x: 84, y: 62 };

const ZONE_LABEL_MARGIN = 1.5;
const AISLE_LABEL_GUTTER = 3;
const SHELF_LABEL_GUTTER = 5;
const SHELF_LEADER_LENGTH = 2.2;

function normalize(value?: string | null) {
  return value?.toLowerCase().trim() ?? null;
}

function getShelfByCode(code?: string | null) {
  if (!code) return null;
  const match = SHELVES.find((shelf) => shelf.code.toLowerCase() === code.toLowerCase());
  return match ?? null;
}

function getAisleByLabel(label?: string | null) {
  if (!label) return null;
  const match = AISLES.find((aisle) => aisle.label.toLowerCase() === label.toLowerCase());
  return match ?? null;
}

function getZoneByName(name?: string | null) {
  if (!name) return null;
  const match = ZONES.find((zone) => zone.name.toLowerCase() === name.toLowerCase());
  return match ?? null;
}

function buildSuggestedPath(target?: ShelfDefinition | null) {
  if (!target) return null;
  const intermediate = { x: target.position.x, y: ENTRANCE.y };
  return [ENTRANCE, intermediate, target.position];
}

// Indoor floor-map styled component. All elements are positioned within a 100x70 grid to keep math simple.
export function StoreMap({ highlight }: { highlight?: Highlight | null }) {
  const normalized = {
    zone: normalize(highlight?.zone),
    aisle: normalize(highlight?.aisle),
    shelf: normalize(highlight?.shelf),
  };

  const activeZone = getZoneByName(normalized.zone ?? undefined);
  const activeAisle = getAisleByLabel(normalized.aisle ?? undefined);
  const activeShelf = getShelfByCode(normalized.shelf ?? undefined);
  const suggestedPath = buildSuggestedPath(activeShelf);

  // Precompute shelf offsets relative to their aisle so we can anchor markers to the aisle group.
  const shelfOffsets = new Map<string, { x: number; y: number }>();
  SHELVES.forEach((shelf) => {
    const aisle = AISLES.find((candidate) => candidate.label === shelf.aisle);
    if (!aisle) return;
    shelfOffsets.set(shelf.code, {
      x: shelf.position.x - aisle.bounds.x,
      y: shelf.position.y - aisle.bounds.y,
    });
  });

  // Derive a coarse zoom tier from the viewport height; the output is deterministic and works server-side.
  const viewHeight = 70;
  const desktopThreshold = 48;
  const tabletThreshold = 32;
  const isDesktop = viewHeight >= desktopThreshold;
  const isTablet = !isDesktop && viewHeight >= tabletThreshold;
  const isMobile = !isDesktop && !isTablet;

  // Label gating driven by cartographic priority rules.
  const activeZoneFromShelf = activeShelf
    ? ZONES.find((zone) => zone.aisles.includes(activeShelf.aisle))
    : null;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">Store map</p>
        <h2 className="text-xl font-semibold text-slate-100">
          Where to walk for your next item
        </h2>
        <p className="text-sm text-slate-400">
          Tap a product to highlight the aisle and shelf.
        </p>
      </header>

      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
        {/*
          The previous implementation positioned HTML elements with percentage-based CSS. As the container resized,
          rounding errors compounded and the shelf markers drifted away from their aisles. Rendering the entire scene
          within a single SVG viewBox gives us a consistent coordinate space, so every element scales uniformly like
          a real map zoom rather than reflowing like a web layout.
        */}
        <svg
          viewBox="0 0 100 70"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          role="img"
          aria-labelledby="store-map-title"
        >
          <title id="store-map-title">Indoor store map</title>
          <defs>
            <radialGradient id="floorGlow" cx="50%" cy="15%" r="70%">
              <stop offset="0%" stopColor="rgba(148,163,184,0.18)" />
              <stop offset="70%" stopColor="rgba(15,23,42,0)" />
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={100} height={70} fill="#0b162d" />
          <rect x={0} y={0} width={100} height={70} fill="url(#floorGlow)" />

          {ZONES.map((zone) => {
            const isZoneActive = zone === activeZone || zone === activeZoneFromShelf;
            const zoneHasActiveAisle = Boolean(
              activeAisle && zone.aisles.includes(activeAisle.label),
            );
            const zoneHasActiveShelf = Boolean(
              activeShelf && zone.aisles.includes(activeShelf.aisle),
            );
            const showZoneLabel = isDesktop || isZoneActive;
            const zoneOpacity = zoneHasActiveShelf
              ? 0.45
              : zoneHasActiveAisle
                ? 0.55
                : isZoneActive
                  ? 0.75
                  : 0.6;
            return (
              <g key={zone.name} opacity={zoneOpacity}>
                <rect
                  x={zone.bounds.x}
                  y={zone.bounds.y}
                  width={zone.bounds.width}
                  height={zone.bounds.height}
                  rx={4}
                  fill={zone.color}
                  stroke="rgba(71,85,105,0.8)"
                  strokeWidth={0.4}
                />
                {showZoneLabel ? (
                  <text
                    x={zone.bounds.x + zone.bounds.width / 2}
                    y={Math.max(zone.bounds.y - ZONE_LABEL_MARGIN, 2)}
                    fill="#e2e8f0"
                    fontSize={3}
                    fontWeight={600}
                    letterSpacing={0.08}
                    textAnchor="middle"
                  >
                    {zone.name}
                  </text>
                ) : null}
              </g>
            );
          })}

          {AISLES.map((aisle) => {
            const isAisleActive = aisle === activeAisle || aisle.label === activeShelf?.aisle;
            const parentZone = ZONES.find((zone) => zone.aisles.includes(aisle.label));
            const shouldShowAisleLabel =
              isDesktop ||
              (isTablet && isAisleActive) ||
              (isMobile && activeShelf && aisle.label === activeShelf.aisle);
            const aisleMidX = aisle.bounds.x + aisle.bounds.width / 2;
            const aislePrefersLeft = aisleMidX > 50;
            const aisleLabelX = aislePrefersLeft
              ? aisle.bounds.x - AISLE_LABEL_GUTTER
              : aisle.bounds.x + aisle.bounds.width + AISLE_LABEL_GUTTER;
            const aisleTextAnchor = aislePrefersLeft ? "end" : "start";
            return (
              <g
                key={aisle.label}
                opacity={isAisleActive ? 1 : parentZone === activeZoneFromShelf ? 0.55 : 0.45}
                transform={`translate(${aisle.bounds.x} ${aisle.bounds.y})`}
              >
                <rect
                  width={aisle.bounds.width}
                  height={aisle.bounds.height}
                  rx={2}
                  fill={isAisleActive ? "rgba(34,211,238,0.75)" : "rgba(71,85,105,0.55)"}
                />
                {shouldShowAisleLabel ? (
                  <text
                    x={aisleLabelX - aisle.bounds.x}
                    y={aisle.bounds.height / 2}
                    dominantBaseline="middle"
                    textAnchor={aisleTextAnchor}
                    fontSize={2.2}
                    fontWeight={700}
                    fill={isAisleActive ? "#02131a" : "#0f172a"}
                  >
                    {aisle.label}
                  </text>
                ) : null}

                {SHELVES.filter((shelf) => shelf.aisle === aisle.label).map((shelf) => {
                  const offset = shelfOffsets.get(shelf.code);
                  if (!offset) return null;
                  const isShelfActive = shelf === activeShelf;
                  const shouldShowShelfLabel =
                    isShelfActive || (isDesktop && !activeShelf);
                  const renderShelfLabel = shouldShowShelfLabel || (isTablet && isShelfActive);
                  const prefersLeft = aislePrefersLeft;
                  const labelAnchorX = prefersLeft
                    ? offset.x - SHELF_LABEL_GUTTER
                    : offset.x + SHELF_LABEL_GUTTER;
                  const leaderX = prefersLeft
                    ? labelAnchorX + SHELF_LEADER_LENGTH
                    : labelAnchorX - SHELF_LEADER_LENGTH;
                  const textAnchor = prefersLeft ? "end" : "start";
                  return (
                    <g key={shelf.code} opacity={isShelfActive ? 1 : 0.65}>
                      <circle
                        cx={offset.x}
                        cy={offset.y}
                        r={2.2}
                        fill={isShelfActive ? "rgba(34,211,238,0.9)" : "rgba(15,23,42,0.92)"}
                        stroke={isShelfActive ? "rgba(165,243,252,0.9)" : "rgba(148,163,184,0.85)"}
                        strokeWidth={0.45}
                      />
                      {renderShelfLabel ? (
                        <g>
                          {/* Leader line keeps the offset label anchored to the exact shelf marker. */}
                          <line
                            x1={offset.x}
                            y1={offset.y}
                            x2={leaderX}
                            y2={offset.y}
                            stroke={isShelfActive ? "rgba(165,243,252,0.9)" : "rgba(148,163,184,0.75)"}
                            strokeWidth={0.35}
                          />
                          <text
                            x={labelAnchorX}
                            y={offset.y}
                            dominantBaseline="middle"
                            textAnchor={textAnchor}
                            fontSize={2}
                            fontWeight={600}
                            fill="#e2e8f0"
                          >
                            {shelf.code}
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {suggestedPath && (
            <polyline
              points={suggestedPath.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke="rgba(94,234,212,0.55)"
              strokeDasharray="2 3.5"
              strokeWidth={0.9}
              strokeLinecap="round"
            />
          )}

          {[{ label: "IN", position: ENTRANCE, tone: "emerald" }, { label: "OUT", position: EXIT, tone: "rose" }].map(
            (marker) => (
              <g
                key={marker.label}
                transform={`translate(${marker.position.x} ${marker.position.y})`}
              >
                <circle
                  r={2.6}
                  fill={marker.tone === "emerald" ? "rgba(16,185,129,0.18)" : "rgba(244,63,94,0.18)"}
                  stroke={marker.tone === "emerald" ? "rgba(52,211,153,0.8)" : "rgba(251,113,133,0.8)"}
                  strokeWidth={0.5}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={2.2}
                  fontWeight={700}
                  fill={marker.tone === "emerald" ? "#bef264" : "#fecdd3"}
                >
                  {marker.label}
                </text>
              </g>
            ),
          )}

          {isDesktop ? (
            <g transform="translate(70 64)" opacity={0.85}>
              <rect
                width={26}
                height={6}
                rx={3}
                fill="rgba(15,23,42,0.78)"
                stroke="rgba(71,85,105,0.6)"
                strokeWidth={0.4}
              />
              <g transform="translate(4 3)">
                <circle r={0.9} fill="rgba(34,211,238,1)" />
                <text x={2} dominantBaseline="middle" fontSize={1.7} fill="#cbd5f5">
                  Shelf
                </text>
              </g>
              <g transform="translate(14 3)">
                <rect x={-1} y={-0.9} width={3} height={1.8} rx={0.8} fill="rgba(100,116,139,0.9)" />
                <text x={3} dominantBaseline="middle" fontSize={1.7} fill="#cbd5f5">
                  Aisle lane
                </text>
              </g>
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
