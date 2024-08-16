export function Fieldset(props: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-2xl mb-3 font-semibold tracking-tight">
        {props.legend}
      </legend>

      <div className="border rounded-lg border-border p-4 md:p-6">
        {props.children}
      </div>
    </fieldset>
  );
}
