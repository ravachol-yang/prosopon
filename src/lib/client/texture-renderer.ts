"use client";
import { SkinViewer } from "skinview3d";

export async function renderTexture(skinUrl, capeUrl) {
  const skinViewer = new SkinViewer({
    width: 150,
    height: 200,
    skin: "/img/steve.png",
    renderPaused: true,
  });

  const isCape = capeUrl && !skinUrl;

  skinViewer.camera.rotation.x = (isCape ? 1 : -1) * (30 / 180) * Math.PI;
  skinViewer.camera.rotation.y = ((isCape ? 180 - 35 : 35) / 180) * Math.PI;
  skinViewer.camera.rotation.z = (isCape ? -1 : 1) * (18 / 180) * Math.PI;

  skinViewer.camera.position.x = 30.5;
  skinViewer.camera.position.y = 22.0;
  skinViewer.camera.position.z = (isCape ? -1 : 1) * 42.0;

  await Promise.all([
    skinUrl ? skinViewer.loadSkin(skinUrl) : Promise.resolve(),
    capeUrl ? skinViewer.loadCape(capeUrl) : Promise.resolve(),
  ]).catch((e) => console.error("Resource Loading Error:", e));

  skinViewer.render();
  const image = skinViewer.canvas.toDataURL();

  skinViewer.dispose();
  return image;
}
