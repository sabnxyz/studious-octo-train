import * as React from "react";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassname?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, wrapperClassname, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div
        className={cn(
          "c-input relative cursor-text rounded-lg border border-gray-300 px-3 py-2",
          props.disabled ? "cursor-default bg-gray-200/20" : "",
          wrapperClassname
        )}
        onClick={(e) => {
          if (!props.disabled)
            (e.currentTarget.childNodes[0] as HTMLInputElement)?.focus();
        }}
      >
        <input
          type={type !== "password" ? type : show ? "text" : "password"}
          className={cn(
            "c-input__input",
            "mt-5 flex w-full bg-transparent outline-none placeholder:text-black/0 disabled:cursor-default",
            type === "password" && "pr-5",
            className
          )}
          ref={ref}
          placeholder="*"
          {...props}
        />
        <span className="c-input__placeholder absolute left-3 -translate-y-1/2 text-sm text-gray-500 transition-[top] duration-150">
          {placeholder}
        </span>
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {show ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
