import { Form, type FormProps } from "@/components/ui/form";

type ClerkFormProps = FormProps;

function ClerkForm({ actions, ...props }: ClerkFormProps) {
  return (
    <Form
      {...props}
      actions={
        <>
          <div
            id="clerk-captcha"
            data-cl-theme="auto"
            data-cl-size="flexible"
          />
          {actions}
        </>
      }
    />
  );
}

export { ClerkForm };
