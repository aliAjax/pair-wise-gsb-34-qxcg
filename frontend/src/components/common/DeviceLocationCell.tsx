import type { FireDevice } from "../../types/FireDevice";

export function DeviceLocationCell({ device }: { device: FireDevice }) {
  return <div className="device-cell">
    <strong>{device.device_code}</strong>
    <span>{device.floor} · {device.location_desc}</span>
  </div>;
}
