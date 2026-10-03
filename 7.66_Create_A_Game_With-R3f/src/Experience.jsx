import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Level, { BlockSpinner } from "./Level.jsx";
import Player from "./Player.jsx";
import { useMemo } from "react";
import useGame from "./stores/useGame.js";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  const debug = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.has("debug");
  }, []);

  return (
    <>
      <color args={["#bdedfc"]} attach="background" />
      {debug && <OrbitControls makeDefault />}

      <Physics debug={debug}>
        <Lights />

        <Level count={blocksCount} seed={blocksSeed} />

        <Player />
      </Physics>
    </>
  );
}
