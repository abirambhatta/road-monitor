// DEMO DATA for the UI only. No detection model exists yet, so these records
// are examples for layout. Measurements, repair and cost are left unavailable
// on purpose: no validated method or sourced price exists yet (brief §11).
import type { Detection, PriceRecord, Quantity, VehicleProfile } from '../domain/types';

export const IS_DEMO_DATA = true;

const NOT_VALIDATED = 'Measurement method not validated yet';

const unavailable = (unit: string, note = NOT_VALIDATED): Quantity => ({
  value: null,
  unit,
  provenance: 'unavailable',
  note,
});

const potholeMeasurements = (): Detection['measurements'] => ({
  length: unavailable('m'),
  width: unavailable('m'),
  area: unavailable('m²'),
  depth: unavailable('cm', 'Needs a validated metric depth method'),
  volume: unavailable('m³', 'Needs validated area and depth'),
});

const potholeRepair = (): Detection['repair'] => ({
  method: null,
  material: null,
  quantity: unavailable('kg', 'Needs volume, repair method and material density'),
  note: 'No documented repair method selected',
});

const potholeCost = (): Detection['cost'] => ({
  materialCostNpr: unavailable('NPR', 'Price missing: no verified price record for this area'),
  priceRecordId: null,
});

const notAPothole = (): Pick<Detection, 'measurements' | 'repair' | 'cost'> => ({
  measurements: potholeMeasurements(),
  repair: { method: null, material: null, quantity: unavailable('kg', 'Not a pothole'), note: 'Not a pothole: no repair estimate' },
  cost: { materialCostNpr: unavailable('NPR', 'Not a pothole'), priceRecordId: null },
});

// Example locations along roads in Kathmandu.
export const DEMO_DETECTIONS: Detection[] = [
  {
    id: 'PH-0007',
    cls: 'pothole',
    confidence: 0.91,
    surface: { type: 'asphalt', confidence: 0.84 },
    detectedAt: '2026-11-21T09:42:10+05:45',
    location: { latitude: 27.70475, longitude: 85.31432, accuracyM: 4 },
    vehicleProfileId: 'veh-car',
    measurements: potholeMeasurements(),
    repair: potholeRepair(),
    cost: potholeCost(),
  },
  {
    id: 'PT-0006',
    cls: 'patch',
    confidence: 0.88,
    surface: { type: 'asphalt', confidence: 0.79 },
    detectedAt: '2026-11-21T09:41:37+05:45',
    location: { latitude: 27.70402, longitude: 85.31251, accuracyM: 5 },
    vehicleProfileId: 'veh-car',
    ...notAPothole(),
  },
  {
    id: 'MH-0005',
    cls: 'manhole_cover',
    confidence: 0.95,
    surface: { type: 'asphalt', confidence: 0.81 },
    detectedAt: '2026-11-21T09:40:58+05:45',
    location: { latitude: 27.70338, longitude: 85.31107, accuracyM: 4 },
    vehicleProfileId: 'veh-car',
    ...notAPothole(),
  },
  {
    id: 'PH-0004',
    cls: 'pothole',
    confidence: 0.76,
    surface: { type: 'gravel', confidence: 0.62 },
    detectedAt: '2026-11-21T09:38:12+05:45',
    location: { latitude: 27.70981, longitude: 85.30812, accuracyM: 7 },
    vehicleProfileId: 'veh-car',
    measurements: potholeMeasurements(),
    repair: potholeRepair(),
    cost: potholeCost(),
  },
  {
    id: 'SB-0003',
    cls: 'speed_bump',
    confidence: 0.83,
    surface: { type: 'concrete', confidence: 0.71 },
    detectedAt: '2026-11-20T16:05:44+05:45',
    location: { latitude: 27.71209, longitude: 85.31766, accuracyM: 6 },
    vehicleProfileId: 'veh-bike',
    ...notAPothole(),
  },
  {
    id: 'PH-0002',
    cls: 'pothole',
    confidence: 0.69,
    surface: { type: 'unknown', confidence: null },
    detectedAt: '2026-11-20T16:02:19+05:45',
    location: { latitude: 27.71455, longitude: 85.32034, accuracyM: 9 },
    vehicleProfileId: 'veh-bike',
    measurements: potholeMeasurements(),
    repair: potholeRepair(),
    cost: potholeCost(),
  },
  {
    id: 'DC-0001',
    cls: 'drain_cover',
    confidence: 0.9,
    surface: { type: 'concrete', confidence: 0.77 },
    detectedAt: '2026-11-20T15:58:03+05:45',
    location: { latitude: 27.71601, longitude: 85.32198, accuracyM: 5 },
    vehicleProfileId: 'veh-bike',
    ...notAPothole(),
  },
];

// Configuration profiles. Camera geometry is "not set" until measured on the vehicle.
export const DEMO_VEHICLES: VehicleProfile[] = [
  { id: 'veh-car', name: 'Hatchback', vehicle: 'car', mount: 'windscreen', cameraHeightM: null, cameraPitchDeg: null, horizontalFovDeg: null, calibrated: false },
  { id: 'veh-bike', name: 'Motorbike', vehicle: 'motorbike', mount: 'handlebar', cameraHeightM: null, cameraPitchDeg: null, horizontalFovDeg: null, calibrated: false },
  { id: 'veh-truck', name: 'Municipal truck', vehicle: 'truck', mount: 'roof', cameraHeightM: null, cameraPitchDeg: null, horizontalFovDeg: null, calibrated: false },
];

export const ACTIVE_VEHICLE_ID = 'veh-car';

// No sourced prices yet. Never fill this with guessed figures (brief §5.9).
export const PRICE_RECORDS: PriceRecord[] = [];

export const findDetection = (id: string) => DEMO_DETECTIONS.find((d) => d.id === id);
export const findVehicle = (id: string) => DEMO_VEHICLES.find((v) => v.id === id);
