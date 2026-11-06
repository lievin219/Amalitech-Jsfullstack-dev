import { useEffect, useReducer, useState } from "react";
import { flowReducer } from "../lib/flowReducer";

export function useFlow() {
  const [flow, dispatch] = useReducer(flowReducer, null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/flow_data.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load flow_data.json.");
        return response.json();
      })
      .then((data) => dispatch({ type: "loaded", flow: data }))
      .catch((reason) => {
        if (reason.name !== "AbortError") setError(reason.message);
      });

    return () => controller.abort();
  }, []);

  return { flow, dispatch, error };
}
