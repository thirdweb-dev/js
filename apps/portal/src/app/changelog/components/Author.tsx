/* eslint-disable @next/next/no-img-element */

export function Author(props: { name: string; profileImage?: string | null }) {
  return (
    <div className="flex items-center gap-1.5">
      {props.profileImage && (
        <img
          src={props.profileImage}
          className="size-8 rounded-[50%] border"
          alt=""
        />
      )}
      <span className="font-medium text-muted-foreground text-sm">
        {props.name}
      </span>
    </div>
  );
}
