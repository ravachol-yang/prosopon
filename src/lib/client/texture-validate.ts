import { SkinModel, TextureType } from "@/generated/prisma/enums";

type TextureResult = {
  type: TextureType;
  model: SkinModel;
};

export async function validateTexture(file: File): Promise<TextureResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject("Can't get context");

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);

        // It's a cape
        if (width === height * 2) {
          resolve({ type: TextureType.CAPE, model: SkinModel.DEFAULT });
          return;
        }

        // It's a skin
        if (width === height) {
          const scale = width / 64;
          const pixel = ctx.getImageData(42 * scale, 48 * scale, 1, 1).data;

          // It's transparent
          const slim = pixel[3] === 0;

          resolve({
            type: TextureType.SKIN,
            model: slim ? SkinModel.SLIM : SkinModel.DEFAULT,
          });
          return;
        }

        // It's not a standard texture
        reject("unsupported texture");
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject("failed to read file");
    reader.readAsDataURL(file);
  });
}
