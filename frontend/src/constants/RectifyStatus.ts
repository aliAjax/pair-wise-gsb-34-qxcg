export const RectifyStatus = ["PENDING", "RECTIFYING", "CLOSED"] as const;
export type RectifyStatus = (typeof RectifyStatus)[number];
export const RectifyStatusText: Record<RectifyStatus, string> = {
  PENDING: "待整改",
  RECTIFYING: "整改中",
  CLOSED: "已关闭"
};
