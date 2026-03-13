import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { B as Button } from "./button-IvqLSGSY.mjs";
import {
  F as FieldGroup,
  a as Field,
  b as FieldLabel,
  c as FieldSeparator,
} from "./field-BdRzanoA.mjs";
import { I as Input } from "./separator-k6ZM8qvW.mjs";
import { a as authClient } from "./auth-client-BQ73uQ-S.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import "@base-ui/react/button";
import "class-variance-authority";
import "react";
import "lucide-react";
import "@base-ui/react/input";
import "@base-ui/react/separator";
import "./auth-BaGll2Xr.mjs";
import "drizzle-orm";
import "./db-a0rvcoi6.mjs";
import "drizzle-orm/node-postgres";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
import "clsx";
import "tailwind-merge";
const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
function LoginForm({ className, ...props }) {
  function githubSignIn() {
    authClient.signIn.social({
      provider: "github",
      callbackURL: location.href,
    });
  }
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    async onSubmit({ value }) {
      const res = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });
      if (res.data?.user) {
        navigate({ to: "/studio" });
      } else {
        toast("login failed");
      }
    },
  });
  return /* @__PURE__ */ jsx("form", {
    className: cn("flex flex-col gap-6", className),
    ...props,
    onSubmit: (e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    children: /* @__PURE__ */ jsxs(FieldGroup, {
      children: [
        /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col items-center gap-1 text-center",
          children: [
            /* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-bold",
              children: "Login to your account",
            }),
            /* @__PURE__ */ jsx("p", {
              className: "text-muted-foreground text-sm text-balance",
              children: "Enter your email below to login to your account",
            }),
          ],
        }),
        /* @__PURE__ */ jsx(form.Field, {
          name: "email",
          children: (field) => {
            return /* @__PURE__ */ jsxs(Field, {
              children: [
                /* @__PURE__ */ jsx(FieldLabel, { htmlFor: field.name, children: "Email" }),
                /* @__PURE__ */ jsx(Input, {
                  id: field.name,
                  type: "email",
                  placeholder: "m@example.com",
                  required: true,
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e) => field.handleChange(e.target.value),
                }),
              ],
            });
          },
        }),
        /* @__PURE__ */ jsx(form.Field, {
          name: "password",
          children: (field) => {
            return /* @__PURE__ */ jsxs(Field, {
              children: [
                /* @__PURE__ */ jsx(FieldLabel, { htmlFor: field.name, children: "Password" }),
                /* @__PURE__ */ jsx(Input, {
                  id: field.name,
                  type: "password",
                  required: true,
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e) => field.handleChange(e.target.value),
                }),
              ],
            });
          },
        }),
        /* @__PURE__ */ jsx(Field, {
          children: /* @__PURE__ */ jsx(form.Subscribe, {
            children: (state) => {
              return /* @__PURE__ */ jsx(Button, {
                disabled: state.isSubmitting,
                type: "submit",
                children: state.isSubmitting ? "Loading..." : "Login",
              });
            },
          }),
        }),
        /* @__PURE__ */ jsx(FieldSeparator, { children: "Or continue with" }),
        /* @__PURE__ */ jsx(Field, {
          children: /* @__PURE__ */ jsxs(Button, {
            variant: "outline",
            type: "button",
            onClick: githubSignIn,
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "mr-1 size-4.5", icon: "ri:github-fill" }),
              "Login with GitHub",
            ],
          }),
        }),
      ],
    }),
  });
}
function StudioLoginPage() {
  return /* @__PURE__ */ jsx("div", {
    className: "flex flex-col min-h-svh gap-4 p-6 md:p-10",
    children: /* @__PURE__ */ jsx("div", {
      className: "flex flex-1 items-center justify-center",
      children: /* @__PURE__ */ jsx("div", {
        className: "w-full max-w-xs mx-auto",
        children: /* @__PURE__ */ jsx(LoginForm, {}),
      }),
    }),
  });
}
export { StudioLoginPage as component };
