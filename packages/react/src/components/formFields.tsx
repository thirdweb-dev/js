import { Spacer } from "./Spacer";
import { InputButton } from "./buttons";
import { ErrorMessage, Input, InputContainer, Label } from "./formElements";

export const FormFieldWithIconButton: React.FC<{
  name: string;
  id: string;
  autocomplete: string;
  right: {
    icon: React.ReactNode;
    onClick: () => void;
  };
  value: string;
  required?: boolean;
  type: "text" | "password";
  onChange: (value: string) => void;
  label: string;
  error?: string;
  noSave?: boolean;
  dataTest?: string;
  placeholder?: string;
}> = (props) => {
  return (
    <div>
      <Label htmlFor={props.id}>{props.label}</Label>
      <Spacer y="sm" />

      <InputContainer data-error={!!props.error}>
        <Input
          variant="transparent"
          required={props.required}
          name={props.name}
          autoComplete={props.autocomplete}
          id={props.id}
          onChange={(e) => props.onChange(e.target.value)}
          value={props.value}
          type={props.noSave ? "text" : props.type}
          style={
            props.type === "password" && props.noSave
              ? ({
                  WebkitTextSecurity: "disc",
                } as React.CSSProperties)
              : undefined
          }
          data-test={props.dataTest}
          placeholder={props.placeholder}
        />

        <InputButton type="button" onClick={props.right.onClick}>
          {props.right.icon}
        </InputButton>
      </InputContainer>

      {props.error && (
        <>
          <Spacer y="sm" />
          <ErrorMessage> {props.error} </ErrorMessage>
        </>
      )}
    </div>
  );
};

export const FormField: React.FC<{
  name: string;
  id: string;
  autocomplete: string;
  value: string;
  required?: boolean;
  type: "text" | "password";
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  errorMessage?: React.ReactNode;
  disabled?: boolean;
}> = (props) => {
  return (
    <div>
      <Label htmlFor={props.id}>{props.label}</Label>
      <Spacer y="sm" />

      <Input
        variant="outline"
        required={props.required}
        name={props.name}
        autoComplete={props.autocomplete}
        id={props.id}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        type={props.type}
        data-error={!!props.errorMessage}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />

      {props.errorMessage && (
        <>
          <Spacer y="xs" />
          <ErrorMessage>{props.errorMessage}</ErrorMessage>
        </>
      )}
    </div>
  );
};
