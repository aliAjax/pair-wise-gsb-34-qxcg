import { useEffect, useMemo, useState } from "react";
import { submitInspectionTask } from "../api/InspectionTask";
import { ChecklistPanel } from "../components/common/ChecklistPanel";
import { EmptyState } from "../components/common/EmptyState";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { TimelineList } from "../components/common/TimelineList";
import { DeviceTypeItemCode } from "../constants/DeviceType";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createInspectionResultEntry } from "../constructors/InspectionResultConstructor";
import { useChecklistProgress } from "../hooks/useChecklistProgress";
import { useBuildingStore } from "../stores/BuildingStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import type { DeviceType } from "../types/DeviceType";
import type { InspectionResultEntry } from "../types/InspectionResult";
import type { InspectionTask } from "../types/InspectionTask";
import { formatDate } from "../utils/formatters";

const READ_ONLY_STATUS = ["SUBMITTED", "REVIEWED"];

export function TasksPage() {
  const tasks = useInspectionTaskStore((state) => state.rows);
  const loadTasks = useInspectionTaskStore((state) => state.load);
  const devices = useFireDeviceStore((state) => state.rows);
  const loadDevices = useFireDeviceStore((state) => state.load);
  const buildings = useBuildingStore((state) => state.rows);
  const loadBuildings = useBuildingStore((state) => state.load);
  const results = useInspectionResultStore((state) => state.rows);
  const loadResults = useInspectionResultStore((state) => state.load);
  const loadHazards = useHazardTicketStore((state) => state.load);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<number, InspectionResultEntry>>({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void loadTasks();
    void loadDevices();
    void loadBuildings();
    void loadResults();
    void loadHazards();
  }, [loadTasks, loadDevices, loadBuildings, loadResults, loadHazards]);

  const selected: InspectionTask | null = useMemo(
    () => tasks.find((task) => task.id === selectedId) ?? tasks[0] ?? null,
    [tasks, selectedId]
  );

  const buildingDevices = useMemo(
    () => (selected ? devices.filter((device) => device.building_id === selected.building_id) : []),
    [devices, selected]
  );
  const deviceIds = useMemo(() => buildingDevices.map((device) => device.id), [buildingDevices]);
  const buildingName = (id: number) => buildings.find((row) => row.id === id)?.name ?? `#${id}`;
  const readOnly = selected ? READ_ONLY_STATUS.includes(selected.status) : false;

  // 切换任务或结果刷新后，用已提交结果回填表单，未录入的设备给默认检查项。
  useEffect(() => {
    if (!selected) return;
    const next: Record<number, InspectionResultEntry> = {};
    for (const device of buildingDevices) {
      const saved = results.find(
        (row) => row.task_id === selected.id && row.device_id === device.id
      );
      next[device.id] = saved
        ? {
            device_id: device.id,
            item_code: saved.item_code,
            result_status: saved.result_status,
            measured_value: saved.measured_value,
            photo_url: saved.photo_url,
            note: saved.note
          }
        : createInspectionResultEntry(device.id, DeviceTypeItemCode[device.device_type as DeviceType] ?? "GENERAL_CHECK");
    }
    setEntries(next);
    setNotice("");
  }, [selected, buildingDevices, results]);

  const progress = useChecklistProgress(deviceIds, entries);

  const patchEntry = (deviceId: number, patch: Partial<InspectionResultEntry>) => {
    setEntries((prev) => ({ ...prev, [deviceId]: { ...prev[deviceId], ...patch } }));
  };

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setNotice("");
    try {
      const items = deviceIds.map((id) => entries[id]).filter(Boolean);
      const summary = await submitInspectionTask(selected.id, items);
      await Promise.all([loadTasks(), loadResults(), loadHazards(), loadDevices()]);
      const hazardCount = summary.hazards_created.length;
      const reopened = summary.hazards_reopened.length;
      setNotice(
        hazardCount + reopened === 0
          ? "提交成功：全部设备正常，未产生隐患单。"
          : `提交成功：生成 ${hazardCount} 张隐患单${reopened ? `，重新打开 ${reopened} 张` : ""}，相关设备已标记为待整改。`
      );
    } catch (err) {
      setNotice(`提交失败：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>巡检任务</h1>
      </div>
      {selected ? <StatusBadge value={selected.status} /> : null}
    </section>

    <section className="task-layout">
      <aside className="panel task-list">
        <h2>任务列表</h2>
        {tasks.length === 0 ? <EmptyState title="暂无巡检任务" /> : tasks.map((task) => (
          <button
            key={task.id}
            className={"task-item" + (selected?.id === task.id ? " active" : "")}
            onClick={() => setSelectedId(task.id)}
          >
            <strong>#{task.id} {buildingName(task.building_id)}</strong>
            <span>{formatDate(task.plan_date)} · {task.checklist_version}</span>
            <StatusBadge value={task.status} />
          </button>
        ))}
      </aside>

      <section className="panel wide">
        {selected ? <>
          <h2>逐项录入 · {buildingName(selected.building_id)}（{selected.checklist_version}）</h2>
          <div className="metrics">
            <StatCard label="应检设备" value={progress.total} />
            <StatCard label="已录入" value={progress.done} />
            <StatCard label="完成度" value={`${progress.percent}%`} />
          </div>
          <ChecklistPanel
            devices={buildingDevices}
            entries={entries}
            onChange={readOnly ? undefined : patchEntry}
            readOnly={readOnly}
          />
          {readOnly ? (
            <p className="notice">该任务已提交，检查结果仅供查看；如需复验请前往隐患整改页。</p>
          ) : (
            <div className="toolbar">
              <button
                className="btn btn-primary"
                disabled={submitting || !progress.complete}
                onClick={() => void submit()}
              >
                {submitting ? "提交中…" : "提交巡检结果"}
              </button>
              {!progress.complete ? <span className="hint">异常项需填写实测值或备注后才能提交</span> : null}
            </div>
          )}
          {notice ? <p className="notice">{notice}</p> : null}
        </> : <EmptyState title="请选择左侧任务开始录入" />}
      </section>

      <aside className="panel">
        <h2>任务动态</h2>
        {selected ? <TimelineList items={[
          { id: "plan", title: `计划巡检 ${buildingName(selected.building_id)}`, time: formatDate(selected.plan_date) },
          ...(selected.finished_at
            ? [{ id: "finish", title: LOG_TEMPLATES.InspectionTask[2], time: formatDate(selected.finished_at) }]
            : [])
        ]} /> : <EmptyState title="暂无动态" />}
      </aside>
    </section>
  </main>;
}
