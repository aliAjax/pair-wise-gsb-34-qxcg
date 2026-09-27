export const HazardSeverity = ["LOW","MEDIUM","HIGH","CRITICAL"] as const;
export type HazardSeverity = (typeof HazardSeverity)[number];
export const HazardSeverityText: Record<HazardSeverity, string> = Object.fromEntries(HazardSeverity.map((value) => [value, value.replace(/_/g, " ")])) as Record<HazardSeverity, string>;
export const DEFAULT_SEVERITY_BY_DEVICE_TYPE: Record<string, HazardSeverity> = {
  EXTINGUISHER: "HIGH",
  HYDRANT: "HIGH",
  SMOKE_DETECTOR: "MEDIUM",
  SPRINKLER: "MEDIUM",
  EXIT_LIGHT: "LOW"
};
