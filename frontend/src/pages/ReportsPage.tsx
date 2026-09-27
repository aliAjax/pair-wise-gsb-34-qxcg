import { EmptyState } from "../components/common/EmptyState";

export function ReportsPage() {
  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">reports</p>
          <h1>合规报表</h1>
        </div>
      </section>
      <div className="panel">
        <EmptyState title="合规报表建设中，敬请期待" />
      </div>
    </main>
  );
}
