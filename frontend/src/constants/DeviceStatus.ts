export const DeviceStatus = ["NORMAL", "PENDING_RECTIFY"] as const;
export type DeviceStatus = (typeof DeviceStatus)[number];
export const DeviceStatusText: Record<DeviceStatus, string> = {
  NORMAL: "正常",
  PENDING_RECTIFY: "待整改"
};
