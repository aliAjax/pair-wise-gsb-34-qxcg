import { useEffect } from "react";
import { EmptyState } from "../components/common/EmptyState";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { DeviceStatusText } from "../constants/DeviceStatus";
import { useBuildingStore } from "../stores/BuildingStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import type { DeviceStatus } from "../types/DeviceStatus";
import { formatDate } from "../utils/formatters";

export function DashboardPage() {
  const { rows: devices, load: loadDevices } = useFireDeviceStore();
  const { rows: hazards, load: loadHazards } = useHazardTicketStore();
  const { rows: tasks, load: loadTasks } = useInspectionTaskStore();
  const { rows: buildings, load: loadBuildings } = useBuildingStore();
  const { rows: results, load: loadResults } = useInspectionResultStore();

  useEffect(() => {
    void loadDevices();
    void loadHazards();
    void loadTasks();
    void loadBuildings();
    void loadResults();
  }, [loadDevices, loadHazards, loadTasks, loadBuildings, loadResults]);

  const openHazards = hazards.filter((ticket) => ticket.rectify_status !== "CLOSED");
  const pendingDevices = devices.filter((device) => device.status === "PENDING_RECTIFY");
  const doneTasks = tasks.filter((task) => task.status === "SUBMITTED" || task.status === "REVIEWED").length;
  const finishRate = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const overdue = openHazards.filter((ticket) => ticket.deadline && new Date(ticket.deadline).getTime() < Date.now());
  const highRisk = openHazards.filter((ticket) => ticket.severity === "HIGH" || ticket.severity === "CRITICAL");

  const deviceOf = (resultId: number) => {
    const result = results.find((row) => row.id === resultId);
    return devices.find((row) => row.id === result?.device_id);
  };

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">fire-inspect</p>
          <h1>消防合规总览</h1>
        </div>
        <StatusBadge
          value={openHazards.length ? "PENDING_RECTIFY" : "NORMAL"}
          label={openHazards.length ? `待整改隐患 ${openHazards.length}` : "无待整改隐患"}
        />
      </section>
      <section className="metrics cols-4">
        <StatCard label="设备总数" value={devices.length} />
        <StatCard label="待整改设备" value={pendingDevices.length} />
        <StatCard label="待整改隐患" value={openHazards.length} />
        <StatCard label="巡检完成率" value={`${finishRate}%`} />
      </section>
      <section className="workbench">
        <div className="panel wide">
          <h2>设备状态分布</h2>
          {buildings.map((building) => {
            const rows = devices.filter((device) => device.building_id === building.id);
            if (!rows.length) return null;
            return (
              <div key={building.id} className="building-block">
                <h3>{building.name}</h3>
                {rows.map((device) => (
                  <div key={device.id} className="row">
                    <strong>{device.device_code}</strong>
                    <span className="muted">
                      {device.floor} · {device.location_desc}
                    </span>
                    <StatusBadge
                      value={device.status}
                      label={DeviceStatusText[device.status as DeviceStatus] ?? device.status}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="panel">
          <h2>高危隐患</h2>
          {!highRisk.length && <EmptyState title="暂无高危隐患" />}
          {highRisk.map((ticket) => {
            const device = deviceOf(ticket.result_id);
            return (
              <div key={ticket.id} className="row">
                <HazardSeverityTag value={ticket.severity} />
                <span className="muted">{device?.device_code ?? `隐患单 #${ticket.id}`}</span>
                <span className="muted">{formatDate(ticket.deadline)}</span>
              </div>
            );
          })}
          <h2>逾期整改</h2>
          <p className="muted">{overdue.length ? `${overdue.length} 条隐患已超过整改期限` : "暂无逾期隐患"}</p>
        </div>
      </section>
    </main>
  );
}
