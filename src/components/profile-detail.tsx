import TextureBind from "@/components/texture-bind";

export default async function ProfileDetail({ profile }) {
  return (
    <div className="border rounded-md min-h-60 md:min-h-80 p-5 my-4 bg-background">
      <h3>材质预览 {!profile.skin && !profile.cape && "(未绑定)"}</h3>
      <div className="place-items-center flex my-4">
        {!profile.skin && !profile.cape ? <TextureBind /> : null}
      </div>

      <h3 className="mb-2">详细信息</h3>
      <p className="my-3">
        角色ID:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">{profile.id}</code>
        </span>
      </p>
      <p className="my-3">
        角色名称:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">{profile.name}</code>
        </span>
      </p>
      <p className="my-3">
        创建于:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">
            {new Date(profile.createdAt).toLocaleDateString()}
          </code>
        </span>
      </p>
      <p className="my-3">
        更新于:
        <span className="mx-2">
          <code className="bg-accent p-1 rounded-sm text-muted-foreground">
            {new Date(profile.updatedAt).toLocaleDateString()}
          </code>
        </span>
      </p>
    </div>
  );
}
