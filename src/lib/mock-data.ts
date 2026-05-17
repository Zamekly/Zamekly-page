// ─── Types ────────────────────────────────────────────────────────────────────

export type BlockStatus = "operational" | "maintenance" | "offline";
export type LockerStatus = "available" | "occupied" | "broken" | "maintenance";
export type AlertType =
  | "battery_low"
  | "water_low"
  | "air_low"
  | "locker_broken"
  | "lost_object";
export type AlertPriority = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "resolved";
export type ObjectStatus = "pending" | "collected";
export type UserRole = "admin" | "operator";

export interface Block {
  id: string;
  name: string;
  location: string;
  lockerCount: number;
  status: BlockStatus;
  batteryLevel: number; // 0–100 %
  waterLevel: number;   // 0–100 %
  airPressure: number;  // 0–100 %
  lastRevision: string; // ISO date
  installedAt: string;
}

export interface Locker {
  id: string;
  blockId: string;
  number: number;
  status: LockerStatus;
  occupiedUntil?: string; // ISO datetime
  hasLostObject: boolean;
}

export interface Alert {
  id: string;
  type: AlertType;
  blockId: string;
  lockerId?: string;
  lockerNumber?: number;
  timestamp: string;
  status: AlertStatus;
  priority: AlertPriority;
  message: string;
}

export interface LostObject {
  id: string;
  blockId: string;
  lockerId: string;
  lockerNumber: number;
  detectedAt: string;
  status: ObjectStatus;
  notes: string;
}

export interface DailyRevenue {
  date: string;  // YYYY-MM-DD
  blockId: string;
  amount: number; // euros
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

export interface AppConfig {
  companyName: string;
  contactEmail: string;
  batteryAlertThreshold: number; // %
  waterAlertThreshold: number;
  airAlertThreshold: number;
}

// ─── Blocks ───────────────────────────────────────────────────────────────────

export const BLOCKS: Block[] = [
  {
    id: "blk-001",
    name: "Barceloneta Sur",
    location: "Playa de la Barceloneta, Barcelona",
    lockerCount: 12,
    status: "operational",
    batteryLevel: 78,
    waterLevel: 65,
    airPressure: 90,
    lastRevision: "2026-05-10",
    installedAt: "2025-06-01",
  },
  {
    id: "blk-002",
    name: "FitLife Madrid",
    location: "Gimnasio FitLife, Calle Serrano 45, Madrid",
    lockerCount: 8,
    status: "operational",
    batteryLevel: 28,
    waterLevel: 80,
    airPressure: 85,
    lastRevision: "2026-05-08",
    installedAt: "2025-09-15",
  },
  {
    id: "blk-003",
    name: "Primavera Sound",
    location: "Parc del Fòrum, Barcelona",
    lockerCount: 16,
    status: "maintenance",
    batteryLevel: 92,
    waterLevel: 22,
    airPressure: 70,
    lastRevision: "2026-05-14",
    installedAt: "2026-05-01",
  },
  {
    id: "blk-004",
    name: "Sants Central",
    location: "Estació de Sants, Barcelona",
    lockerCount: 10,
    status: "operational",
    batteryLevel: 88,
    waterLevel: 75,
    airPressure: 95,
    lastRevision: "2026-05-12",
    installedAt: "2025-11-20",
  },
];

// ─── Lockers ──────────────────────────────────────────────────────────────────

function makeLockers(blockId: string, count: number): Locker[] {
  const patterns: LockerStatus[] = [
    "available","occupied","available","available","occupied","available",
    "maintenance","available","occupied","available","broken","available",
    "available","available","occupied","available",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `${blockId}-lk-${String(i + 1).padStart(2, "0")}`,
    blockId,
    number: i + 1,
    status: patterns[i % patterns.length],
    occupiedUntil:
      patterns[i % patterns.length] === "occupied"
        ? new Date(Date.now() + (30 + i * 17) * 60 * 1000).toISOString()
        : undefined,
    hasLostObject: i === 6 && blockId === "blk-001",
  }));
}

export const LOCKERS: Locker[] = [
  ...makeLockers("blk-001", 12),
  ...makeLockers("blk-002", 8),
  ...makeLockers("blk-003", 16),
  ...makeLockers("blk-004", 10),
];

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const ALERTS: Alert[] = [
  {
    id: "alt-001",
    type: "battery_low",
    blockId: "blk-002",
    timestamp: "2026-05-17T08:30:00Z",
    status: "active",
    priority: "critical",
    message: "Nivel de batería solar al 28 %. Por debajo del umbral crítico.",
  },
  {
    id: "alt-002",
    type: "water_low",
    blockId: "blk-003",
    timestamp: "2026-05-17T09:15:00Z",
    status: "active",
    priority: "high",
    message: "Depósito de agua al 22 %. Revisar antes de la próxima sesión de limpieza.",
  },
  {
    id: "alt-003",
    type: "lost_object",
    blockId: "blk-001",
    lockerId: "blk-001-lk-07",
    lockerNumber: 7,
    timestamp: "2026-05-17T11:42:00Z",
    status: "active",
    priority: "medium",
    message: "Objeto detectado por IA en taquilla nº 7 tras liberarla.",
  },
  {
    id: "alt-004",
    type: "locker_broken",
    blockId: "blk-002",
    lockerId: "blk-002-lk-03",
    lockerNumber: 3,
    timestamp: "2026-05-16T14:20:00Z",
    status: "active",
    priority: "high",
    message: "Taquilla nº 3 no responde al comando de apertura.",
  },
  {
    id: "alt-005",
    type: "air_low",
    blockId: "blk-001",
    timestamp: "2026-05-15T10:00:00Z",
    status: "resolved",
    priority: "low",
    message: "Presión de aire recuperada tras recarga manual.",
  },
  {
    id: "alt-006",
    type: "battery_low",
    blockId: "blk-004",
    timestamp: "2026-05-13T07:00:00Z",
    status: "resolved",
    priority: "medium",
    message: "Batería repuesta. Panel solar operativo.",
  },
];

// ─── Lost objects ─────────────────────────────────────────────────────────────

export const LOST_OBJECTS: LostObject[] = [
  {
    id: "obj-001",
    blockId: "blk-001",
    lockerId: "blk-001-lk-07",
    lockerNumber: 7,
    detectedAt: "2026-05-17T11:42:00Z",
    status: "pending",
    notes: "Posible bolso pequeño. Imagen disponible en sistema.",
  },
  {
    id: "obj-002",
    blockId: "blk-004",
    lockerId: "blk-004-lk-02",
    lockerNumber: 2,
    detectedAt: "2026-05-16T18:10:00Z",
    status: "pending",
    notes: "Prenda de ropa. Usuario notificado por email.",
  },
  {
    id: "obj-003",
    blockId: "blk-002",
    lockerId: "blk-002-lk-05",
    lockerNumber: 5,
    detectedAt: "2026-05-15T13:55:00Z",
    status: "collected",
    notes: "Auriculares. Recogidos por el operador a las 15:30.",
  },
  {
    id: "obj-004",
    blockId: "blk-001",
    lockerId: "blk-001-lk-03",
    lockerNumber: 3,
    detectedAt: "2026-05-14T10:22:00Z",
    status: "collected",
    notes: "Llaves. Entregadas en recepción de playa.",
  },
  {
    id: "obj-005",
    blockId: "blk-003",
    lockerId: "blk-003-lk-11",
    lockerNumber: 11,
    detectedAt: "2026-05-12T20:05:00Z",
    status: "collected",
    notes: "Botella de agua y gorra.",
  },
];

// ─── Revenue ──────────────────────────────────────────────────────────────────

function generateRevenue(): DailyRevenue[] {
  const rows: DailyRevenue[] = [];
  const baseAmounts: Record<string, number> = {
    "blk-001": 320,
    "blk-002": 180,
    "blk-003": 420,
    "blk-004": 260,
  };

  for (let d = 0; d < 365; d++) {
    const date = new Date("2026-05-17");
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];

    for (const blockId of Object.keys(baseAmounts)) {
      const base = baseAmounts[blockId];
      const weekday = date.getDay();
      const weekendBoost = weekday === 0 || weekday === 6 ? 1.5 : 1;
      const noise = 0.7 + Math.random() * 0.6;
      const amount = Math.round(base * weekendBoost * noise * 100) / 100;
      rows.push({ date: dateStr, blockId, amount });
    }
  }
  return rows;
}

export const REVENUE: DailyRevenue[] = generateRevenue();

// ─── Users ────────────────────────────────────────────────────────────────────

export const USERS: AppUser[] = [
  {
    id: "usr-001",
    email: "dstrzeleckiiphone@icloud.com",
    name: "David Strzelecki",
    role: "admin",
    createdAt: "2025-06-01T00:00:00Z",
    lastLogin: "2026-05-17T08:00:00Z",
  },
  {
    id: "usr-002",
    email: "maria.garcia@zamekly.com",
    name: "María García",
    role: "operator",
    createdAt: "2025-09-01T00:00:00Z",
    lastLogin: "2026-05-16T17:30:00Z",
  },
  {
    id: "usr-003",
    email: "carlos.lopez@zamekly.com",
    name: "Carlos López",
    role: "operator",
    createdAt: "2026-01-15T00:00:00Z",
    lastLogin: "2026-05-15T09:10:00Z",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

export const CONFIG: AppConfig = {
  companyName: "Zamekly",
  contactEmail: "info@zamekly.com",
  batteryAlertThreshold: 30,
  waterAlertThreshold: 25,
  airAlertThreshold: 20,
};

// ─── Derived helpers ──────────────────────────────────────────────────────────

export function getBlockById(id: string): Block | undefined {
  return BLOCKS.find((b) => b.id === id);
}

export function getLockersForBlock(blockId: string): Locker[] {
  return LOCKERS.filter((l) => l.blockId === blockId);
}

export function getActiveAlerts(): Alert[] {
  return ALERTS.filter((a) => a.status === "active").sort((a, b) => {
    const priority = { critical: 0, high: 1, medium: 2, low: 3 };
    return priority[a.priority] - priority[b.priority];
  });
}

export function getTodayRevenue(): number {
  const today = new Date().toISOString().split("T")[0];
  return REVENUE.filter((r) => r.date === today).reduce(
    (sum, r) => sum + r.amount,
    0
  );
}

export function getRevenueForPeriod(
  period: "today" | "week" | "month" | "year"
): DailyRevenue[] {
  const now = new Date("2026-05-17");
  const cutoff = new Date(now);
  if (period === "today") cutoff.setDate(now.getDate() - 1);
  else if (period === "week") cutoff.setDate(now.getDate() - 7);
  else if (period === "month") cutoff.setMonth(now.getMonth() - 1);
  else cutoff.setFullYear(now.getFullYear() - 1);

  const cutoffStr = cutoff.toISOString().split("T")[0];
  return REVENUE.filter((r) => r.date >= cutoffStr);
}
