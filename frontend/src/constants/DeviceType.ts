export const DeviceType = ["EXTINGUISHER","HYDRANT","SMOKE_DETECTOR","SPRINKLER","EXIT_LIGHT"] as const;
export type DeviceType = (typeof DeviceType)[number];
export const DeviceTypeText: Record<DeviceType, string> = Object.fromEntries(DeviceType.map((value) => [value, value.replace(/_/g, " ")])) as Record<DeviceType, string>;
export const DeviceTypeItemCode: Record<DeviceType, string> = {
  EXTINGUISHER: "PRESSURE_CHECK",
  HYDRANT: "HYDRANT_PRESSURE",
  SMOKE_DETECTOR: "SMOKE_TEST",
  SPRINKLER: "PRESSURE_CHECK",
  EXIT_LIGHT: "LIGHT_TEST"
};
