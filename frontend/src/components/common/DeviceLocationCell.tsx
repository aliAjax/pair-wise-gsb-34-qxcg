import type { FireDevice } from "../../types/FireDevice";

export function DeviceLocationCell({ device, buildingName }: { device: FireDevice; buildingName?: string }) {
  return (
    <div className="location-cell">
      <strong>{device.device_code}</strong>
      <span>{[buildingName, device.floor, device.location_desc].filter(Boolean).join(" · ")}</span>
    </div>
  );
}
