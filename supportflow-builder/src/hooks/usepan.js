import { useRef, useState } from "react";

export function usePan() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const grabOffset = useRef(null);

  const handlers = {
    onPointerDown(event) {
      if (event.target.closest(".node-card")) return;
      grabOffset.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event) {
      if (!grabOffset.current) return;
      setPan({
        x: event.clientX - grabOffset.current.x,
        y: event.clientY - grabOffset.current.y,
      });
    },
    onPointerUp() {
      grabOffset.current = null;
    },
  };

  return { pan, setPan, handlers };
}