import { useEffect, useMemo } from "react";
import { EmptyState } from "../components/common/EmptyState";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { STATUS_TEXT } from "../constants/statusText";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import { formatDate } from "../utils/formatters";

export function DashboardPage() {
  const devices = useFireDeviceStore((state) => state.rows);
  const loadDevices = useFireDeviceStore((state) => state.load);
  const tickets = useHazardTicketStore((state) => state.rows);
  const loadTickets = useHazardTicketStore((state) => state.load);
  const tasks = useInspectionTaskStore((state) => state.rows);
  const loadTasks = useInspectionTaskStore((state) => state.load);

  useEffect(() => {
    void loadDevices();
    void loadTickets();
    void loadTasks();
  }, [loadDevices, loadTickets, loadTasks]);

  const openTickets = useMemo(() => tickets.filter((ticket) => ticket.rectify_status === "OPEN"), [tickets]);
  const pendingDevices = devices.filter((device) => device.status === "PENDING_RECTIFY");
  const overdue = openTickets.filter((ticket) => ticket.deadline && new Date(ticket.deadline).getTime() < Date.now());
  const finishedTasks = tasks.filter((task) => ["SUBMITTED", "REVIEWED"].includes(task.status));
  const completion = tasks.length === 0 ? 0 : Math.round((finishedTasks.length / tasks.length) * 100);
  const highRisk = openTickets.filter((ticket) => ["HIGH", "CRITICAL"].includes(ticket.severity));

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>消防合规总览</h1>
      </div>
      <StatusBadge value="OPEN" label={`待整改隐患 ${openTickets.length}`} />
    </section>

    <section className="metrics">
      <StatCard label="设备总数" value={devices.length} />
      <StatCard label="待整改设备" value={pendingDevices.length} />
      <StatCard label="待整改隐患" value={openTickets.length} />
      <StatCard label="逾期整改" value={overdue.length} />
      <StatCard label="巡检完成率" value={`${completion}%`} />
    </section>

    <section className="workbench">
      <div className="panel wide">
        <h2>待整改隐患</h2>
        {openTickets.length === 0 ? <EmptyState title="当前没有待整改隐患" /> : (
          <div className="table">
            {openTickets.map((ticket) => (
              <article className="row" key={ticket.id}>
                <strong>隐患单 #{ticket.id}</strong>
                <HazardSeverityTag value={ticket.severity} />
                <span>整改期限 {formatDate(ticket.deadline)}</span>
              </article>
            ))}
          </div>
        )}
      </div>
      <div className="panel">
        <h2>设备状态分布</h2>
        <div className="table">
          <article className="row">
            <strong>{STATUS_TEXT.DeviceStatus.NORMAL}</strong>
            <span>{devices.length - pendingDevices.length} 台</span>
            <StatusBadge value="NORMAL" label={STATUS_TEXT.DeviceStatus.NORMAL} />
          </article>
          <article className="row">
            <strong>{STATUS_TEXT.DeviceStatus.PENDING_RECTIFY}</strong>
            <span>{pendingDevices.length} 台</span>
            <StatusBadge value="PENDING_RECTIFY" label={STATUS_TEXT.DeviceStatus.PENDING_RECTIFY} />
          </article>
          <article className="row">
            <strong>高危隐患</strong>
            <span>{highRisk.length} 条</span>
            <StatusBadge value="HIGH" label="高危" />
          </article>
        </div>
      </div>
    </section>
  </main>;
}
