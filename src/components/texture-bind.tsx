"use client";

import { X, Search, Shirt, Upload, LoaderCircle } from "lucide-react";
import { ChangeEvent, DragEvent, FormEvent, useState } from "react";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { bindProfileTexture, uploadTexture } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SkinModel, TextureType } from "@/generated/prisma/enums";
import { Label } from "@/components/ui/label";
import { validateTexture } from "@/lib/client/texture-validate";
import { uploadTextureParams } from "@/lib/schema";

export default function TextureBind({ profile }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [pending, setPending] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<TextureType>("SKIN");
  const [model, setModel] = useState<SkinModel>("DEFAULT");
  const [autoType, setAutoType] = useState<boolean>(false); // Judge type and model automatically

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "image/png") {
        try {
          const result = await validateTexture(selectedFile);
          setAutoType(true);
          setType(result.type);
          setModel(result.model);
        } catch (e) {
          alert(e);
          return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        alert("只允许上传PNG文件");
      }
    }
  }

  const router = useRouter();

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    setPending(true);

    if (!name) setName(file!.name);
    const data = {
      name: name ? name : file!.name,
      type: type,
      model: type === TextureType.SKIN ? model : undefined,
    };
    const validated = uploadTextureParams.safeParse(data);
    if (!validated) {
      setStatus(false);
      setMessage("Invalid input");
    } else {
      // Upload
      const formData = new FormData();
      const { name, type, model } = validated.data!;
      formData.append("name", name!);
      formData.append("type", type);
      formData.append("model", model!);
      formData.append("file", file!);

      const result = await uploadTexture(formData);

      if (!result.success) {
        setStatus(false);
        setMessage(result.message || "未知错误");
      } else {
        // bind
        const bindResult = await bindProfileTexture({
          profileId: profile.id,
          textureId: result.data!.id,
          type: result.data!.type,
        });

        if (!bindResult.success) {
          setStatus(false);
          setMessage(bindResult.message || "未知错误");
        } else {
          setStatus(true);
          setMessage("绑定成功，请刷新");
          router.refresh();
        }
      }
    }
    setPending(false);
  }

  return (
    <>
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
          className={clsx(
            "rounded-sm border-dashed border-muted-foreground border p-6 w-full relative",
            isDragging && "border-sky-500 bg-sky-50 scale-[1.02]",
          )}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            accept="image/png"
          />
          <div className="grid place-items-center my-3">
            <div
              className={clsx(
                "rounded-full bg-muted w-15 h-15 grid place-items-center",
                isDragging && "bg-sky-100 text-sky-700",
              )}
            >
              <Shirt />
            </div>
            <h2 className={clsx("mt-4 mb-1.5 text-center", isDragging && "text-sky-700")}>
              绑定材质
            </h2>
            <p className="text-muted-foreground text-center break-all max-w-60 my-1.5 h-10">
              {isDragging ? "松开投放文件" : "拖拽到此处上传材质, 披风, 或从你的衣柜中选择"}
            </p>
            <div className="h-20">
              {!isDragging && (
                <div className="flex gap-3">
                  <button className="p-1 rounded-sm h-9 w-20 bg-foreground my-4 text-background hover:bg-gray-800">
                    <p className="w-full">
                      <span>
                        <Upload size={17} className="inline mr-2" />
                      </span>
                      上传
                    </p>
                  </button>
                  <Link href="/dashboard/closet" className="z-11">
                    <button className="p-1 rounded-sm h-9 w-20 bg-background my-4  border border-foreground hover:bg-gray-100 z-11">
                      <p className="w-full">
                        <span>
                          <Search size={17} className="inline mr-2" />
                        </span>
                        选择
                      </p>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="break-all">已选择: {file.name}</p>
          <button
            className="p-1 rounded-sm h-9 w-20 bg-destructive my-4 text-background hover:bg-destructive/75"
            onClick={() => {
              setFile(null);
              setPreview("");
              setName("");
              setType("SKIN");
              setModel("DEFAULT");
              setAutoType(false);
              setMessage("");
            }}
          >
            <p className="w-full">
              <span>
                <X size={17} className="inline mr-2" />
              </span>
              清除
            </p>
          </button>
          <img src={preview} alt={file.name} className="h-40 my-4" />

          <form onSubmit={handleUpload} className="my-4 gap-2">
            <Label htmlFor="name" className="my-2">
              名称 (可选)
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={file?.name}
              className="my-2"
            />

            <div className="flex gap-3 my-2">
              <div className="w-fit">
                <Label htmlFor="type" className="mb-2">
                  材质类型
                </Label>
                <Select
                  name="type"
                  value={type}
                  onValueChange={(value) => {
                    setAutoType(false);
                    setType(value as TextureType);
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TextureType.SKIN}>皮肤</SelectItem>
                    <SelectItem value={TextureType.CAPE}>披风</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === "SKIN" && (
                <div className="w-fit">
                  <Label htmlFor="model" className="mb-2">
                    皮肤模型
                  </Label>
                  <Select
                    name="model"
                    value={model}
                    onValueChange={(value) => {
                      setAutoType(false);
                      setModel(value as SkinModel);
                    }}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="选择模型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SkinModel.DEFAULT}>DEFAULT</SelectItem>
                      <SelectItem value={SkinModel.SLIM}>SLIM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {autoType ? (
              <div className="text-center text-sm text-green-500 my-2">
                {"已自动判断类型和模型, 如无错误请勿修改"}
              </div>
            ) : (
              <div className="text-center text-sm text-red-500 my-2">
                {"手动设置类型, 请确保无误"}
              </div>
            )}

            <div className="flex flex-row-reverse">
              <Button type="submit" disabled={pending}>
                {pending && <LoaderCircle className="animate-spin" />}
                {pending ? "正在处理..." : "提交"}
              </Button>
            </div>

            {!status && message && (
              <div className="text-center text-sm text-red-500">{message}</div>
            )}
            {status && message && (
              <div className="text-center text-sm text-green-500">{message}</div>
            )}
          </form>
        </div>
      )}
    </>
  );
}
