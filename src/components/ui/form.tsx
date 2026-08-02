import type { ComponentProps, ReactNode } from "react";
import {cn} from "@/shared/lib/utils";

type FormProps = ComponentProps<"form"> & {
  actions?: ReactNode;
};

function Form({ actions, children, className, ...props }: FormProps) {
  return (
    <form className={cn("space-y-5", className)} {...props}>
      {children}
      {actions}
    </form>
  );
}

export { Form, type FormProps };
