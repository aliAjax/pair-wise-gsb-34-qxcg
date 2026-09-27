import { formatRisk } from "../../utils/formatters";
import { StatusBadge } from "./StatusBadge";

export function HazardSeverityTag({ value }: { value: string }) {
  return <StatusBadge value={value} label={formatRisk(value)} />;
}
