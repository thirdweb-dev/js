export function Fieldset(props: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border border-border bg-card">
      <div className="border-border border-b p-4 md:px-6 md:py-5">
        <legend className="font-semibold text-xl tracking-tight">
          {props.legend}
        </legend>
      </div>

      <div className="p-4 md:px-6 md:py-6">{props.children}</div>
    </fieldset>
  );
}
