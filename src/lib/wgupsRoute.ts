import type { WgupsData } from './fetchProjectData';

const CX = 100;
const CY = 100;
const RADIUS = 78;

export type WgupsRouteVisual = {
  hub: { x: number; y: number };
  stops: Array<{ x: number; y: number; address: string }>;
  truckPaths: Array<{ truckId: number; d: string; colorIndex: number }>;
  nodeRadius: number;
  showNodes: boolean;
  strokeWidth: number;
  truckRadius: number;
};

// Node/stroke sizing shrinks as stop count grows so dense runs (100+ stops)
// don't render as an overlapping blob — chord length between adjacent stops
// on the circle shrinks with n, so dot/stroke size has to shrink with it too.
function computeSizing(n: number) {
  if (n <= 1) {
    return { nodeRadius: 3, showNodes: true, strokeWidth: 1, truckRadius: 3 };
  }
  const chord = 2 * RADIUS * Math.sin(Math.PI / n);
  const nodeRadius = Math.min(3, chord * 0.3);
  const showNodes = nodeRadius >= 1.2;
  const strokeWidth = n > 80 ? 0.5 : n > 40 ? 0.75 : 1;
  const truckRadius = Math.max(2, Math.min(3, chord * 0.35));
  return { nodeRadius, showNodes, strokeWidth, truckRadius };
}

// Lays out stops evenly on a circle (hub at center) since the source data
// is a distance matrix, not real coordinates — deterministic per run, not geographic.
export function buildWgupsRouteVisual(data: WgupsData): WgupsRouteVisual {
  const stopOrder: string[] = [];
  const stopIndex = new Map<string, number>();

  for (const truck of data.routes) {
    for (const stop of truck.stops) {
      if (!stopIndex.has(stop.address)) {
        stopIndex.set(stop.address, stopOrder.length);
        stopOrder.push(stop.address);
      }
    }
  }

  const n = stopOrder.length;
  const stops = stopOrder.map((address, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      address,
      x: CX + RADIUS * Math.cos(angle),
      y: CY + RADIUS * Math.sin(angle),
    };
  });

  const truckPaths = data.routes
    .filter((truck) => truck.stops.length > 0)
    .map((truck, i) => {
      const points = truck.stops.map((stop) => stops[stopIndex.get(stop.address)!]);
      const d = [
        `M ${CX},${CY}`,
        ...points.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`),
        `L ${CX},${CY}`,
      ].join(' ');
      return { truckId: truck.truck_id, d, colorIndex: i % 4 };
    });

  return { hub: { x: CX, y: CY }, stops, truckPaths, ...computeSizing(n) };
}
