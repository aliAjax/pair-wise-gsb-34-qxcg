import { useState } from "react";
import { closeHazardTicket } from "../api/HazardTicket";
import type { CloseHazardTicketSummary } from "../types/HazardTicket";

// 隐患复验关闭流程：提交关闭动作、跟踪进行中的单据、暴露错误信息。
export function useHazardFlow(onClosed?: () => void | Promise<void>) {
  const [closingId, setClosingId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const close = async (ticketId: number, rectifyNote: string): Promise<CloseHazardTicketSummary | null> => {
    setClosingId(ticketId);
    setError("");
    try {
      const summary = await closeHazardTicket(ticketId, rectifyNote);
      await onClosed?.();
      return summary;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setClosingId(null);
    }
  };

  return { closingId, error, close };
}
