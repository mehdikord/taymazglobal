import { isLand } from "@/lib/geo/land";

export type DotMapConfig = {
  lon0: number;
  lon1: number;
  lat0: number;
  lat1: number;
  width: number;
  height: number;
  step: number;
  radius: number;
};

/** Equirectangular projection helpers for a dotted land map. */
export function createProjection(config: DotMapConfig) {
  const px = (lon: number) => ((lon - config.lon0) / (config.lon1 - config.lon0)) * config.width;
  const py = (lat: number) => ((config.lat1 - lat) / (config.lat1 - config.lat0)) * config.height;
  return { px, py };
}

/** Builds a single SVG path of circles for every land cell of the grid. */
export function buildDotsPath(config: DotMapConfig) {
  const { px, py } = createProjection(config);
  const r = config.radius;
  const parts: string[] = [];
  for (let lat = config.lat1 - config.step / 2; lat > config.lat0; lat -= config.step) {
    for (let lon = config.lon0 + config.step / 2; lon < config.lon1; lon += config.step) {
      if (!isLand(lon, lat)) continue;
      parts.push(`M${px(lon).toFixed(1)} ${py(lat).toFixed(1)}m-${r} 0a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 -${r * 2} 0`);
    }
  }
  return parts.join("");
}

/** Fits a map window around a set of points with padding, keeping the given aspect ratio. */
export function fitDotMap(points: { lat: number; lon: number }[], width: number, height: number, options?: { minLonSpan?: number; minLatSpan?: number; step?: number; radius?: number }): DotMapConfig {
  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = points.length ? Math.min(...lats) : 20;
  const maxLat = points.length ? Math.max(...lats) : 60;
  const minLon = points.length ? Math.min(...lons) : 10;
  const maxLon = points.length ? Math.max(...lons) : 70;
  const ratio = width / height;
  let lonSpan = Math.max(maxLon - minLon + 24, options?.minLonSpan ?? 36);
  let latSpan = Math.max(maxLat - minLat + 16, options?.minLatSpan ?? 20);
  if (lonSpan / latSpan > ratio) latSpan = lonSpan / ratio;
  else lonSpan = latSpan * ratio;
  const cLon = (minLon + maxLon) / 2;
  const cLat = (minLat + maxLat) / 2;
  return {
    lon0: cLon - lonSpan / 2,
    lon1: cLon + lonSpan / 2,
    lat0: Math.max(-60, cLat - latSpan / 2),
    lat1: Math.min(80, cLat + latSpan / 2),
    width,
    height,
    step: options?.step ?? lonSpan / 70,
    radius: options?.radius ?? 3.2,
  };
}
