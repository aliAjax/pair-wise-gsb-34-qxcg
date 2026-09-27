import { ResultStatus, ResultStatusText } from "../../constants/ResultStatus";
import { STATUS_TEXT } from "../../constants/statusText";
import type { FireDevice } from "../../types/FireDevice";
import type { InspectionResultEntry } from "../../types/InspectionResult";
import { DeviceLocationCell } from "./DeviceLocationCell";
import { StatusBadge } from "./StatusBadge";

interface ChecklistPanelProps {
  devices: FireDevice[];
  entries: Record<number, InspectionResultEntry>;
  onChange?: (deviceId: number, patch: Partial<InspectionResultEntry>) => void;
  readOnly?: boolean;
}

export function ChecklistPanel({ devices, entries, onChange, readOnly = false }: ChecklistPanelProps) {
  return <div className="checklist">
    {devices.map((device) => {
      const entry = entries[device.id];
      return <article className="checklist-item" key={device.id}>
        <header>
          <DeviceLocationCell device={device} />
          <div className="checklist-tags">
            <StatusBadge value={device.device_type} label={STATUS_TEXT.DeviceType[device.device_type as keyof typeof STATUS_TEXT.DeviceType] ?? device.device_type} />
            <StatusBadge value={device.status} label={STATUS_TEXT.DeviceStatus[device.status as keyof typeof STATUS_TEXT.DeviceStatus] ?? device.status} />
          </div>
        </header>
        <div className="checklist-fields">
          <label>
            检查结果
            <select
              value={entry?.result_status ?? "NORMAL"}
              disabled={readOnly}
              onChange={(event) => onChange?.(device.id, { result_status: event.target.value })}
            >
              {ResultStatus.map((status) => <option key={status} value={status}>{ResultStatusText[status]}</option>)}
            </select>
          </label>
          <label>
            实测值
            <input
              value={entry?.measured_value ?? ""}
              disabled={readOnly}
              placeholder="如 0.35MPa"
              onChange={(event) => onChange?.(device.id, { measured_value: event.target.value })}
            />
          </label>
          <label className="wide-field">
            备注
            <input
              value={entry?.note ?? ""}
              disabled={readOnly}
              placeholder={entry?.result_status === "ABNORMAL" ? "异常项必填：描述问题现象" : "选填"}
              onChange={(event) => onChange?.(device.id, { note: event.target.value })}
            />
          </label>
        </div>
      </article>;
    })}
  </div>;
}
