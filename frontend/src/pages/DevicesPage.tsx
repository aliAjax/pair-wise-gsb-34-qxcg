import { useEffect } from "react";
import { DeviceLocationCell } from "../components/common/DeviceLocationCell";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge } from "../components/common/StatusBadge";
import { DeviceStatusText } from "../constants/DeviceStatus";
import { DeviceTypeText } from "../constants/DeviceType";
import { usePagination } from "../hooks/usePagination";
import { useBuildingStore } from "../stores/BuildingStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import type { DeviceStatus } from "../types/DeviceStatus";
import type { DeviceType } from "../types/DeviceType";
import { formatDate } from "../utils/formatters";

export function DevicesPage() {
  const { rows: devices, load: loadDevices } = useFireDeviceStore();
  const { rows: buildings, load: loadBuildings } = useBuildingStore();
  const { page, setPage, pageSize, pageRows, total } = usePagination(devices);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    void loadDevices();
    void loadBuildings();
  }, [loadDevices, loadBuildings]);

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">devices</p>
          <h1>消防设备台账</h1>
        </div>
        <StatusBadge value="NORMAL" label={`共 ${devices.length} 台`} />
      </section>
      <div className="panel">
        {!devices.length && <EmptyState title="暂无设备" />}
        {!!devices.length && (
          <table className="data-table">
            <thead>
              <tr>
                <th>设备</th>
                <th>类型</th>
                <th>楼栋</th>
                <th>状态</th>
                <th>下次维保</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((device) => (
                <tr key={device.id}>
                  <td>
                    <DeviceLocationCell device={device} />
                  </td>
                  <td>{DeviceTypeText[device.device_type as DeviceType] ?? device.device_type}</td>
                  <td>{buildings.find((row) => row.id === device.building_id)?.name ?? `楼栋 ${device.building_id}`}</td>
                  <td>
                    <StatusBadge
                      value={device.status}
                      label={DeviceStatusText[device.status as DeviceStatus] ?? device.status}
                    />
                  </td>
                  <td>{formatDate(device.next_maintenance_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {pageCount > 1 && (
          <div className="actions">
            <button className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              上一页
            </button>
            <span className="muted">
              {page} / {pageCount}
            </span>
            <button className="btn ghost" disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
              下一页
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
