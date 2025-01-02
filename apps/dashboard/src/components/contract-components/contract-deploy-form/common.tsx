export function Fieldset(props: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-semibold text-2xl tracking-tight">
        {props.legend}
      </legend>

      <div className="rounded-lg border border-border p-4 md:p-6">
        {props.children}
      </div>
    </fieldset>
  );
}
