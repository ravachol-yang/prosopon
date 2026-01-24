import { Shirt, Upload } from "lucide-react";
import Link from "next/link";

export default function TextureEmpty() {
  return (
    <div className="rounded-sm border-dashed border-muted-foreground border p-6 w-full">
      <div className="grid place-items-center my-3">
        <div className="rounded-full bg-muted w-15 h-15 grid place-items-center">
          <Shirt />
        </div>
        <h2 className="mt-4 mb-1.5 text-center">未绑定材质</h2>
        <p className="text-muted-foreground text-center break-all max-w-60 my-1.5">
          创建角色, 上传材质和披风
        </p>
        <div className="flex gap-3">
          <button className="p-1 rounded-sm h-9 w-20 bg-foreground my-4 text-background hover:bg-gray-800">
            <p className="w-full">
              <span>
                <Upload size={17} className="inline mr-2" />
              </span>
              上传
            </p>
          </button>
          <button className="p-1 rounded-sm h-9 w-20 bg-background my-4  border border-foreground hover:bg-gray-100">
            <p className="w-full">
              <span>
                <Upload size={17} className="inline mr-2" />
              </span>
              选择
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
