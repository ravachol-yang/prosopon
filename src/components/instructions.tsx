"use client";

import { YGG_API_PREFIX } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Instructions() {
  function dndLabel_dragstart(event) {
    const uri = "authlib-injector:yggdrasil-server:" + encodeURIComponent(YGG_API_PREFIX);
    event.dataTransfer.setData("text/plain", uri);
    event.dataTransfer.dropEffect = "copy";
  }

  return (
    <div className="border rounded-md p-5 mb-4 bg-background">
      <p className="text-base leading-10">
        <strong>本站的Yggdrasil API地址:</strong>{" "}
        <code className="bg-destructive/1 text-destructive">{YGG_API_PREFIX}</code>
        <br />
        <strong>使用方法</strong>: 将下方按钮拖到支持的启动器完成自动设置
        <br />
        <strong>手动设置:</strong> <br />
        HMCL: 账户 -{">"} 添加认证服务器 -{">"} 输入上方的地址
      </p>
      <Separator className="my-2" />
      <div className="flex flex-row-reverse w-full">
        <span id="dndLabel" draggable="true" onDragStart={() => dndLabel_dragstart(event)}>
          <Button className="my-1 bg-sky-600 rounded-xs h-12 text-base hover:bg-sky-500 hover:scale-110">
            自动设置
          </Button>
        </span>
      </div>
    </div>
  );
}
