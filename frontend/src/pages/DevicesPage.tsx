import { useEffect } from "react";
import { DeviceLocationCell } from "../components/common/DeviceLocationCell";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge } from "../components/common/StatusBadge";
import { STATUS_TEXT } from "../constants/statusText";
import { useBuildingStore } from "../stores/BuildingStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { formatDate } from "../utils/formatters";

export function DevicesPage() {
  const devices = useFireDeviceStore((state) => state.rows);
  const loadDevices = useFireDeviceStore((state) => state.load);
  const buildings = useBuildingStore((state) => state.rows);
  const loadBuildings = useBuildingStore((state) => state.load);

  useEffect(() => {
    void loadDevices();
    void loadBuildings();
  }, [loadDevices, loadBuildings]);

  const buildingName = (id: number) => buildings.find((row) => row.id === id)?.name ?? `#${id}`;

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>消防设备台账</h1>
      </div>
      <StatusBadge value="PENDING_RECTIFY" label={`待整改 ${devices.filter((d) => d.status === "PENDING_RECTIFY").length}`} />
    </section>

    <section className="panel wide">
      <h2>设备列表</h2>
      {devices.length === 0 ? <EmptyState title="暂无设备" /> : (
        <div className="table">
          {devices.map((device) => (
            <article className="row device-row" key={device.id}>
              <DeviceLocationCell device={device} />
              <span>{buildingName(device.building_id)}</span>
              <span>{STATUS_TEXT.DeviceType[device.device_type as keyof typeof STATUS_TEXT.DeviceType] ?? device.device_type}</span>
              <span>下次维保 {formatDate(device.next_maintenance_at)}</span>
              <StatusBadge
                value={device.status}
                label={STATUS_TEXT.DeviceStatus[device.status as keyof typeof STATUS_TEXT.DeviceStatus] ?? device.status}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  </main>;
}
