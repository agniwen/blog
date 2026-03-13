import { jsx, jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { S as Separator } from "./separator-k6ZM8qvW.mjs";
function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx("label", {
    "data-slot": "label",
    className: cn(
      "gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
      className,
    ),
    ...props,
  });
}
function FieldSet({ className, ...props }) {
  return /* @__PURE__ */ jsx("fieldset", {
    "data-slot": "field-set",
    className: cn(
      "gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col",
      className,
    ),
    ...props,
  });
}
function FieldGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", {
    "data-slot": "field-group",
    className: cn(
      "gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group flex w-full flex-col",
      className,
    ),
    ...props,
  });
}
const fieldVariants = cva("data-[invalid=true]:text-destructive gap-3 group/field flex w-full", {
  variants: {
    orientation: {
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});
function Field({ className, orientation = "vertical", ...props }) {
  return /* @__PURE__ */ jsx("div", {
    role: "group",
    "data-slot": "field",
    "data-orientation": orientation,
    className: cn(fieldVariants({ orientation }), className),
    ...props,
  });
}
function FieldLabel({ className, ...props }) {
  return /* @__PURE__ */ jsx(Label, {
    "data-slot": "field-label",
    className: cn(
      "has-data-checked:bg-primary/5 has-data-checked:border-primary/50 dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:border *:data-[slot=field]:p-4 group/field-label peer/field-label flex w-fit leading-snug",
      "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
      className,
    ),
    ...props,
  });
}
function FieldSeparator({ children, className, ...props }) {
  return /* @__PURE__ */ jsxs("div", {
    "data-slot": "field-separator",
    "data-content": !!children,
    className: cn(
      "-my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 relative",
      className,
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx(Separator, { className: "absolute inset-0 top-1/2" }),
      children &&
        /* @__PURE__ */ jsx("span", {
          className: "text-muted-foreground px-2 bg-background relative mx-auto block w-fit",
          "data-slot": "field-separator-content",
          children,
        }),
    ],
  });
}
function FieldError({ className, children, errors, ...props }) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors?.length) {
      return null;
    }
    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];
    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }
    return /* @__PURE__ */ jsx("ul", {
      className: "ml-4 flex list-disc flex-col gap-1",
      children: uniqueErrors.map(
        (error, index) =>
          error?.message && /* @__PURE__ */ jsx("li", { children: error.message }, index),
      ),
    });
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", {
    role: "alert",
    "data-slot": "field-error",
    className: cn("text-destructive text-sm font-normal", className),
    ...props,
    children: content,
  });
}
export {
  FieldGroup as F,
  Field as a,
  FieldLabel as b,
  FieldSeparator as c,
  FieldSet as d,
  FieldError as e,
};
