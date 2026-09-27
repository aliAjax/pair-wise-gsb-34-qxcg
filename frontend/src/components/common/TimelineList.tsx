import { EmptyState } from "./EmptyState";

export interface TimelineItem {
  id: string | number;
  title: string;
  time?: string;
}

export function TimelineList({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) return <EmptyState title="暂无动态" />;
  return <ul className="timeline">
    {items.map((item) => <li key={item.id}>
      <span className="timeline-dot" />
      <div><strong>{item.title}</strong>{item.time ? <time>{item.time}</time> : null}</div>
    </li>)}
  </ul>;
}
