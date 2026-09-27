import { EmptyState } from "./EmptyState";

export interface TimelineItem {
  time: string;
  text: string;
}

export function TimelineList({ items }: { items: TimelineItem[] }) {
  if (!items.length) return <EmptyState title="暂无动态" />;
  return (
    <ul className="timeline">
      {items.map((item, index) => (
        <li key={index}>
          <time>{item.time}</time>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
