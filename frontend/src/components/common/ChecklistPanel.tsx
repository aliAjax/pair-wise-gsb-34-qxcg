import { CHECKLIST_ITEMS, DEFAULT_CHECKLIST_ITEM } from "../../constants/ChecklistItem";
import { DeviceTypeText } from "../../constants/DeviceType";
import { HazardSeverity } from "../../constants/HazardSeverity";
import { ResultStatus, ResultStatusText } from "../../constants/ResultStatus";
import type { DeviceType } from "../../types/DeviceType";
import type { FireDevice } from "../../types/FireDevice";
import type { ChecklistEntry } from "../../types/InspectionResult";
import { formatRisk } from "../../utils/formatters";
import { EmptyState } from "./EmptyState";

interface ChecklistPanelProps {
  devices: FireDevice[];
  entries: Record<number, ChecklistEntry>;
  disabled?: boolean;
  onChange: (deviceId: number, patch: Partial<ChecklistEntry>) => void;
}

export function ChecklistPanel({ devices, entries, disabled = false, onChange }: ChecklistPanelProps) {
  if (!devices.length) return <EmptyState title="该楼栋暂无待检设备" />;
  return (
    <div className="checklist">
      {devices.map((device) => {
        const entry = entries[device.id];
        const item = CHECKLIST_ITEMS[device.device_type as DeviceType] ?? DEFAULT_CHECKLIST_ITEM;
        return (
          <article key={device.id} className={"check-item" + (entry?.result_status === "ABNORMAL" ? " abnormal" : "")}>
            <header>
              <strong>{device.device_code}</strong>
              <span>
                {DeviceTypeText[device.device_type as DeviceType] ?? device.device_type} · {device.floor} · {device.location_desc}
              </span>
            </header>
            <div className="check-body">
              <span className="check-label">
                {item.label}（{item.code}）
              </span>
              <div className="radio-group">
                {ResultStatus.map((status) => (
                  <label key={status} className={entry?.result_status === status ? "checked" : ""}>
                    <input
                      type="radio"
                      name={`result-${device.id}`}
                      disabled={disabled}
                      checked={entry?.result_status === status}
                      onChange={() => onChange(device.id, { result_status: status })}
                    />
                    {ResultStatusText[status]}
                  </label>
                ))}
              </div>
              <input
                className="text-input"
                placeholder="实测值，如 压力 1.2MPa"
                disabled={disabled}
                value={entry?.measured_value ?? ""}
                onChange={(event) => onChange(device.id, { measured_value: event.target.value })}
              />
              <input
                className="text-input"
                placeholder="备注说明"
                disabled={disabled}
                value={entry?.note ?? ""}
                onChange={(event) => onChange(device.id, { note: event.target.value })}
              />
              {entry?.result_status === "ABNORMAL" && (
                <select
                  className="text-input"
                  disabled={disabled}
                  value={entry.severity}
                  onChange={(event) => onChange(device.id, { severity: event.target.value })}
                >
                  {HazardSeverity.map((severity) => (
                    <option key={severity} value={severity}>
                      隐患等级：{formatRisk(severity)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
