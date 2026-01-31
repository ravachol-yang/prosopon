import { useEffect, useRef } from "react";
import { IdleAnimation, SkinViewer } from "skinview3d";

export default function TexturePreview({
  skinUrl,
  capeUrl,
}: {
  skinUrl: string | null;
  capeUrl: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viewer = new SkinViewer({
      canvas: canvasRef.current,
      width: 300,
      height: 400,
      skin: "img/steve.png",
    });

    if (skinUrl) viewer.loadSkin(skinUrl);
    if (capeUrl) viewer.loadCape(capeUrl);

    viewer.animation = new IdleAnimation();

    viewer.camera.position.x = 30.5;
    viewer.camera.position.y = 22.0;
    viewer.camera.position.z = capeUrl && !skinUrl ? -42.0 : 42.0;

    return () => viewer.dispose();
  }, [capeUrl, skinUrl]);

  return <canvas ref={canvasRef} className="rounded-lg shadow-inner" />;
}
