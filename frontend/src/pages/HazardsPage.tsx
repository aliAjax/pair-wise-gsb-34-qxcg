import { useEffect, useMemo, useState } from "react";
import { DeviceLocationCell } from "../components/common/DeviceLocationCell";
import { EmptyState } from "../components/common/EmptyState";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { StatusBadge } from "../components/common/StatusBadge";
import { TimelineList } from "../components/common/TimelineList";
import { STATUS_TEXT } from "../constants/statusText";
import { useHazardFlow } from "../hooks/useHazardFlow";
import { usePagination } from "../hooks/usePagination";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { formatDate } from "../utils/formatters";

export function HazardsPage() {
  const tickets = useHazardTicketStore((state) => state.rows);
  const loadTickets = useHazardTicketStore((state) => state.load);
  const results = useInspectionResultStore((state) => state.rows);
  const loadResults = useInspectionResultStore((state) => state.load);
  const devices = useFireDeviceStore((state) => state.rows);
  const loadDevices = useFireDeviceStore((state) => state.load);

  const [notes, setNotes] = useState<Record<number, string>>({});
  const [notice, setNotice] = useState("");

  const reload = async () => {
    await Promise.all([loadTickets(), loadDevices(), loadResults()]);
  };
  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { closingId, error, close } = useHazardFlow(async () => {
    await reload();
    setNotice("复验通过：隐患单已关闭，设备恢复为正常。");
  });

  const deviceOf = (resultId: number) => {
    const result = results.find((row) => row.id === resultId);
    return result ? devices.find((row) => row.id === result.device_id) : undefined;
  };

  const sorted = useMemo(() => [...tickets].sort((a, b) => Number(a.rectify_status !== "OPEN") - Number(b.rectify_status !== "OPEN") || b.id - a.id), [tickets]);
  const { page, setPage, pageSize, pageRows, total } = usePagination(sorted);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const confirmClose = async (ticketId: number) => {
    setNotice("");
    await close(ticketId, notes[ticketId]?.trim() || "复验合格");
  };

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>隐患整改</h1>
      </div>
      <StatusBadge value="OPEN" label={`待整改 ${tickets.filter((t) => t.rectify_status === "OPEN").length}`} />
    </section>

    <section className="panel wide">
      <h2>隐患整改单</h2>
      {pageRows.length === 0 ? <EmptyState title="暂无隐患单" /> : pageRows.map((ticket) => {
        const device = deviceOf(ticket.result_id);
        const open = ticket.rectify_status === "OPEN";
        return <article className="hazard-item" key={ticket.id}>
          <header>
            <strong>隐患单 #{ticket.id}</strong>
            <HazardSeverityTag value={ticket.severity} />
            <StatusBadge
              value={ticket.rectify_status}
              label={STATUS_TEXT.RectifyStatus[ticket.rectify_status as keyof typeof STATUS_TEXT.RectifyStatus] ?? ticket.rectify_status}
            />
          </header>
          <div className="hazard-body">
            {device ? <DeviceLocationCell device={device} /> : <span>设备信息缺失</span>}
            {device ? (
              <StatusBadge
                value={device.status}
                label={`设备：${STATUS_TEXT.DeviceStatus[device.status as keyof typeof STATUS_TEXT.DeviceStatus] ?? device.status}`}
              />
            ) : null}
          </div>
          <TimelineList items={[
            { id: "deadline", title: "整改期限", time: formatDate(ticket.deadline) },
            ...(ticket.closed_at ? [{ id: "closed", title: `复验关闭：${ticket.rectify_note}`, time: formatDate(ticket.closed_at) }] : [])
          ]} />
          {open ? (
            <div className="toolbar">
              <input
                value={notes[ticket.id] ?? ""}
                placeholder="复验说明（默认：复验合格）"
                onChange={(event) => setNotes((prev) => ({ ...prev, [ticket.id]: event.target.value }))}
              />
              <button
                className="btn btn-primary"
                disabled={closingId === ticket.id}
                onClick={() => void confirmClose(ticket.id)}
              >
                {closingId === ticket.id ? "关闭中…" : "复验通过并关闭"}
              </button>
            </div>
          ) : null}
        </article>;
      })}
      <div className="pager">
        <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</button>
        <span>{page} / {pageCount}</span>
        <button className="btn" disabled={page >= pageCount} onClick={() => setPage(page + 1)}>下一页</button>
      </div>
      {error ? <p className="notice error">{error}</p> : null}
      {notice ? <p className="notice">{notice}</p> : null}
    </section>
  </main>;
}
