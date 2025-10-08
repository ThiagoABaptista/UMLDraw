import { useEffect, useState } from "react";

export const useCanvasResize = (initialOffset: number = 50) => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - initialOffset,
  });

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight - initialOffset,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialOffset]);

  return stageSize;
};
