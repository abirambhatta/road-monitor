// Core data types for Road Monitor. UI-independent so each module
// (detection, surface, measurement, cost) can be tested on its own.

/** What the detector says the object is. Look-alikes are kept as their own
 *  classes so they are never counted or costed as potholes. */
export type DetectionClass =
  | 'pothole'
  | 'patch'
  | 'manhole_cover'
  | 'drain_cover'
  | 'speed_bump'
  | 'crack'
  | 'puddle'
  | 'shadow';

/** Road surface material (not road category). */
export type SurfaceType = 'asphalt' | 'concrete' | 'gravel' | 'earth' | 'unknown';

/** Where a value comes from. Shown next to every number in the UI. */
export type Provenance =
  | 'measured' // checked against a validated measurement method
  | 'estimate' // produced by a model
  | 'assumption' // engineering assumption (density, compaction, wastage…)
  | 'price' // taken from a sourced price record
  | 'unavailable'; // no validated method or source yet

export interface Quantity {
  value: number | null;
  unit: string;
  provenance: Provenance;
  /** Why the value is missing, or how it was obtained. */
  note?: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  /** Horizontal accuracy in metres, if known. */
  accuracyM?: number;
}

export interface Detection {
  id: string;
  cls: DetectionClass;
  confidence: number; // 0–1
  surface: { type: SurfaceType; confidence: number | null };
  detectedAt: string; // ISO 8601
  location: GeoPoint;
  vehicleProfileId: string;
  measurements: {
    length: Quantity;
    width: Quantity;
    area: Quantity;
    depth: Quantity;
    volume: Quantity;
  };
  repair: {
    method: string | null;
    material: string | null;
    quantity: Quantity;
    note?: string;
  };
  cost: {
    materialCostNpr: Quantity;
    priceRecordId: string | null;
  };
}

/** One sourced material price (brief §5.9). */
export interface PriceRecord {
  id: string;
  material: string;
  grade: string;
  unit: string;
  unitPriceNpr: number;
  area: string; // district / municipality / market
  source: string;
  sourceUrl?: string;
  effectiveDate: string;
  taxIncluded: boolean;
  transportIncluded: boolean;
  lastVerified: string;
}

export type MountPosition = 'dashboard' | 'windscreen' | 'roof' | 'handlebar' | 'bumper';

export interface VehicleProfile {
  id: string;
  name: string;
  vehicle: 'car' | 'motorbike' | 'bus' | 'truck';
  mount: MountPosition;
  cameraHeightM: number | null;
  cameraPitchDeg: number | null;
  horizontalFovDeg: number | null;
  calibrated: boolean;
}
