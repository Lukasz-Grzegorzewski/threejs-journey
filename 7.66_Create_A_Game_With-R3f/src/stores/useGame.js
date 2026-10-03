import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const subscribed = subscribeWithSelector((set) => {
  return {
    blocksCount: 10,
    blocksSeed: 0,
    phase: "ready",
    startTime: 0,
    endTime: 0,
    start: () => {
      set((store) => {
        return store.phase === "ready"
          ? { phase: "playing", startTime: Date.now() }
          : {};
      });
    },
    restart: () => {
      set((store) => {
        return store.phase === "playing" || store.phase === "ended"
          ? { phase: "ready", blocksSeed: Math.random() }
          : {};
      });
    },
    end: () => {
      set((store) => {
        return store.phase === "playing"
          ? { phase: "ended", endTime: Date.now() }
          : {};
      });
    },
  };
});

export default create(subscribed);
