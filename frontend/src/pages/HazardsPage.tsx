import { useEffect } from "react";
import { DeviceLocationCell } from "../components/common/DeviceLocationCell";
import { EmptyState } from "../components/common/EmptyState";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { StatusBadge } from "../components/common/StatusBadge";
import { TimelineList } from "../components/common/TimelineList";
import { RectifyStatusText } from "../constants/RectifyStatus";
import { useHazardFlow } from "../hooks/useHazardFlow";
import { useBuildingStore } from "../stores/BuildingStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import type { RectifyStatus } from "../types/RectifyStatus";
import { formatDate } from "../utils/formatters";

export function HazardsPage() {
  const { rows: hazards, load: loadHazards } = useHazardTicketStore();
  const { rows: results, load: loadResults } = useInspectionResultStore();
  const { rows: devices, load: loadDevices } = useFireDeviceStore();
  const { rows: buildings, load: loadBuildings } = useBuildingStore();
  const flow = useHazardFlow();

  useEffect(() => {
    void loadHazards();
    void loadResults();
    void loadDevices();
    void loadBuildings();
  }, [loadHazards, loadResults, loadDevices, loadBuildings]);

  const deviceOf = (resultId: number) => {
    const result = results.find((row) => row.id === resultId);
    return devices.find((row) => row.id === result?.device_id);
  };

  const open = hazards.filter((ticket) => ticket.rectify_status !== "CLOSED");
  const timeline = hazards
    .filter((ticket) => ticket.rectify_status === "CLOSED")
    .map((ticket) => ({ time: formatDate(ticket.closed_at), text: `隐患单 #${ticket.id} 复验通过，已关闭` }));

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">hazard</p>
          <h1>隐患整改</h1>
        </div>
        <StatusBadge value={open.length ? "PENDING" : "CLOSED"} label={`待整改 ${open.length}`} />
      </section>
      <div className="grid-2">
        <div className="panel">
          <h2>隐患单列表</h2>
          {!hazards.length && <EmptyState title="暂无隐患单" />}
          {!!hazards.length && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>编号</th>
                  <th>等级</th>
                  <th>设备</th>
                  <th>整改期限</th>
                  <th>状态</th>
                  <th>处理</th>
                </tr>
              </thead>
              <tbody>
                {hazards.map((ticket) => {
                  const device = deviceOf(ticket.result_id);
                  const isClosed = ticket.rectify_status === "CLOSED";
                  return (
                    <tr key={ticket.id}>
                      <td>#{ticket.id}</td>
                      <td>
                        <HazardSeverityTag value={ticket.severity} />
                      </td>
                      <td>
                        {device ? (
                          <DeviceLocationCell
                            device={device}
                            buildingName={buildings.find((row) => row.id === device.building_id)?.name}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{formatDate(ticket.deadline)}</td>
                      <td>
                        <StatusBadge
                          value={ticket.rectify_status}
                          label={RectifyStatusText[ticket.rectify_status as RectifyStatus] ?? ticket.rectify_status}
                        />
                      </td>
                      <td>
                        {isClosed ? (
                          <span className="muted">
                            {ticket.rectify_note || "已关闭"}
                            <br />
                            {formatDate(ticket.closed_at)}
                          </span>
                        ) : flow.closingId === ticket.id ? (
                          <div className="close-form">
                            <input
                              className="text-input"
                              placeholder="复验说明，如 已更换并复验合格"
                              value={flow.note}
                              onChange={(event) => flow.setNote(event.target.value)}
                            />
                            {flow.error && <p className="banner err">{flow.error}</p>}
                            <div className="actions">
                              <button className="btn" disabled={flow.busy} onClick={() => void flow.confirm()}>
                                {flow.busy ? "提交中…" : "确认关闭"}
                              </button>
                              <button className="btn ghost" onClick={flow.cancel}>
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button className="btn" onClick={() => flow.begin(ticket.id)}>
                            复验通过并关闭
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="panel">
          <h2>关闭动态</h2>
          <TimelineList items={timeline} />
        </div>
      </div>
    </main>
  );
}
