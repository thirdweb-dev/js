/* eslint-disable @next/next/no-img-element */

export function Author(props: { name: string; profileImage?: string | null }) {
  return (
    <div className="flex items-center gap-1.5">
      {props.profileImage && (
        <img
          alt=""
          className="size-6 rounded-[50%] border"
          src={props.profileImage}
        />
      )}
      <span className="text-muted-foreground text-sm">{props.name}</span>
    </div>
  );
}
