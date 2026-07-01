import type { WgupsData } from './fetchProjectData';

const CX = 100;
const CY = 100;
const RADIUS = 78;

export type WgupsRouteVisual = {
  hub: { x: number; y: number };
  stops: Array<{ x: number; y: number; address: string }>;
  truckPaths: Array<{ truckId: number; d: string; colorIndex: number }>;
};

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

  return { hub: { x: CX, y: CY }, stops, truckPaths };
}
