import type { DeviceType } from "../types/DeviceType";

export interface ChecklistItemDef {
  code: string;
  label: string;
}

export const CHECKLIST_ITEMS: Record<DeviceType, ChecklistItemDef> = {
  EXTINGUISHER: { code: "PRESSURE_CHECK", label: "压力表检查" },
  HYDRANT: { code: "WATER_PRESSURE", label: "水压测试" },
  SMOKE_DETECTOR: { code: "ALARM_TEST", label: "报警联动测试" },
  SPRINKLER: { code: "SPRINKLER_HEAD", label: "喷头外观检查" },
  EXIT_LIGHT: { code: "LIGHT_TEST", label: "点亮测试" }
};

export const DEFAULT_CHECKLIST_ITEM: ChecklistItemDef = { code: "GENERAL_CHECK", label: "通用检查" };
