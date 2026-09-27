import { useState } from "react";
import { useHazardTicketStore } from "../stores/HazardTicketStore";

export function useHazardFlow() {
  const close = useHazardTicketStore((state) => state.close);
  const [closingId, setClosingId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const begin = (ticketId: number) => {
    setClosingId(ticketId);
    setNote("");
    setError("");
  };

  const cancel = () => {
    setClosingId(null);
    setNote("");
    setError("");
  };

  const confirm = async () => {
    if (closingId === null) return false;
    setBusy(true);
    setError("");
    try {
      await close(closingId, note);
      cancel();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { closingId, note, setNote, error, busy, begin, cancel, confirm };
}
