import { useState, useCallback } from "react";
import { API_BASE } from "./constants";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const call = useCallback(async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const e = await r.json();
        throw new Error(e.detail || `HTTP ${r.status}`);
      }
      return await r.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return { call, loading, error };
}
