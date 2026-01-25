"use client";

import { X, Search, Shirt, Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useState } from "react";
import { clsx } from "clsx";
import { z } from "zod";
import { SkinModel, TextureType } from "@/generated/prisma/enums";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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

const textureUploadSchema = z.object({
  name: z.string().max(32, "不多于32个字符").optional(),
  type: z.enum(TextureType, "类型错误"),
  model: z.enum(SkinModel, "模型错误").optional(),
});

export default function TextureBind({ profile }) {
  const form = useForm({
    resolver: zodResolver(textureUploadSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      type: "SKIN",
      model: "DEFAULT",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const type = useWatch({ control: form.control, name: "type" });

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "image/png") {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        alert("只允许上传PNG文件");
      }
    }
  };

  const router = useRouter();

  async function handleUpload(data: z.infer<typeof textureUploadSchema>) {
    if (!data.name) data.name = file?.name;
    if (data.type !== "SKIN") data.model = "DEFAULT";

    const formData = new FormData();
    formData.append("name", data.name!);
    formData.append("type", data.type!);
    formData.append("file", file!);

    formData.append("model", data.model!);

    const result = await uploadTexture(formData);

    if (!result.success) {
      setStatus(false);
      setMessage(result.message || "未知错误");
    } else {
      const bindResult = await bindProfileTexture({
        profileId: profile.id,
        textureId: result.data!.id,
        type: data.type,
      });

      if (!bindResult.success) {
        setStatus(false);
        setMessage(result.message || "未知错误");
      } else {
        setStatus(true);
        setMessage("绑定成功，请刷新");
        router.refresh();
      }
    }
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
                  <button className="p-1 rounded-sm h-9 w-20 bg-background my-4  border border-foreground hover:bg-gray-100 z-11">
                    <p className="w-full">
                      <span>
                        <Search size={17} className="inline mr-2" />
                      </span>
                      选择
                    </p>
                  </button>
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
            onClick={() => setFile(null)}
          >
            <p className="w-full">
              <span>
                <X size={17} className="inline mr-2" />
              </span>
              清除
            </p>
          </button>
          <img src={preview} alt={file.name} className="h-40 my-4" />
          <form onSubmit={form.handleSubmit(handleUpload)}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="my-4">
                  <FieldLabel htmlFor="name">名称 (可选)</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder={file?.name}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex gap-3 my-4">
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Field className="w-fit">
                    <FieldLabel htmlFor="type">材质类型</FieldLabel>
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SKIN">皮肤</SelectItem>
                        <SelectItem value="CAPE">披风</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              {type === "SKIN" && (
                <Controller
                  name="model"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="w-fit">
                      <FieldLabel htmlFor="model">皮肤模型</FieldLabel>
                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="model">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DEFAULT">DEFAULT</SelectItem>
                          <SelectItem value="SLIM">SLIM</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              )}
            </div>

            <div className="flex flex-row-reverse">
              <Button type="submit">提交</Button>
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
