// Shared types for API contracts

export type Checkpoint = {
  name: string;
  location: string;
  timestamp: string; // ISO
  actor?: string;
  notes?: string;
};

export type TraceResult = {
  productId: string;
  productName?: string;
  status?: string;
  checkpoints: Checkpoint[];
};

// --- Geo + Blockchain Traceability Types ---

export type GeoPoint = {
  lat: number;
  lng: number;
  accuracyMeters?: number;
};

export type ChainProof = {
  txHash: string; // e.g., 0xabc...
  blockNumber?: number;
  anchoredAt?: string; // ISO
};

export type TraceEventType =
  | "harvest"
  | "shipment"
  | "processing"
  | "transfer"
  | "listing"
  | "scan";

export interface TraceEventBase {
  type: TraceEventType;
  timestamp: string; // ISO
  actor?: string;
  location?: string; // human readable
  geo?: GeoPoint; // optional precise coords
  notes?: string;
  productId?: string;
  batchId?: string;
  lotId?: string;
  chain?: ChainProof; // on-chain anchoring proof
}

export type HarvestEvent = TraceEventBase & {
  type: "harvest";
  lotId: string;
  herbName: string;
  quantity?: number;
  unit?: string;
};

export type ProcessingEvent = TraceEventBase & {
  type: "processing";
  batchId: string;
  inputLots?: string[]; // lot ids
  coaHash?: string; // certificate of analysis hash
};

export type ShipmentEvent = TraceEventBase & {
  type: "shipment";
  routeId?: string;
  temperaturesC?: number[]; // optional time series
};

export type TransferEvent = TraceEventBase & { type: "transfer" };
export type ListingEvent = TraceEventBase & { type: "listing" };
export type ScanEvent = TraceEventBase & { type: "scan" };

export type TraceEvent =
  | HarvestEvent
  | ProcessingEvent
  | ShipmentEvent
  | TransferEvent
  | ListingEvent
  | ScanEvent;

export type HarvestSubmission = {
  herbName: string;
  quantity: number;
  unit: string;
  harvestDate: string; // ISO date
  location: string;
  farmerId?: string;
  notes?: string;
  geo?: GeoPoint; // optional precise coordinates
};

export type HarvestResponse = {
  harvestId: string;
};

export type BatchSubmission = {
  batchId: string;
  inputHarvestIds: string[];
  processDate: string; // ISO date
  facilityId?: string;
  notes?: string;
};

export type BatchResponse = {
  batchId: string;
};
