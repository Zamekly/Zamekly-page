// Tipos compartidos — los datos ahora viven en Supabase.

export type BlockStatus  = "operational" | "maintenance" | "offline";
export type LockerStatus = "available" | "occupied" | "broken" | "maintenance";
export type AlertType    = "battery_low" | "water_low" | "air_low" | "locker_broken" | "lost_object";
export type AlertPriority = "critical" | "high" | "medium" | "low";
export type AlertStatus  = "active" | "resolved";
export type ObjectStatus = "pending" | "collected";
export type UserRole     = "admin" | "operator";

export interface Block {
  id: string;
  name: string;
  location: string;
  lockerCount: number;
  status: BlockStatus;
  batteryLevel: number;
  waterLevel: number;
  airPressure: number;
  lastRevision: string;
  installedAt: string;
}

export interface Locker {
  id: string;
  blockId: string;
  number: number;
  status: LockerStatus;
  occupiedUntil?: string;
  hasLostObject: boolean;
}
