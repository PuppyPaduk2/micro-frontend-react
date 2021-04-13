import { useState, useEffect, useMemo } from "react";
import { createScript } from "libs/dynamic-script";

type Status = null | "loaded" | "failed"

export const useDynamicScript = (src: string): Status => {
  const [status, setStatus] = useState<Status>(null);
  const script = useMemo(() => createScript(src), [src]);

  useEffect(() => {
    script.load()
      .then(() => setStatus("loaded"))
      .catch(() => setStatus("failed"));
  }, [script]);

  return status;
}
