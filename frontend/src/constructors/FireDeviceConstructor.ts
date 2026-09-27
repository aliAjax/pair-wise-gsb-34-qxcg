import type { FireDevice } from "../types/FireDevice";

export const createDefaultFireDevice = (overrides: Partial<FireDevice> = {}): FireDevice => ({
  id: 1 as never,
  building_id: 1 as never,
  device_code: "EXT-1F-001" as never,
  device_type: "EXTINGUISHER" as never,
  floor: "1F" as never,
  location_desc: "1层东侧走廊" as never,
  install_date: "2025-03-11T09:00:00Z" as never,
  status: "NORMAL" as never,
  next_maintenance_at: "2026-10-11T09:00:00Z" as never,
  ...overrides
});

export const createFireDeviceForm = createDefaultFireDevice;
export const createFireDeviceResponse = createDefaultFireDevice;
