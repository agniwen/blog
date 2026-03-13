import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { h as hono, S as StudioShell, A as AdminContainer } from "./studio-shell-XAoOk8iz.mjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { parseResponse } from "hono/client";
import { Trash2Icon } from "lucide-react";
import { useState, useId } from "react";
import ContentLoader from "react-content-loader";
import { toast } from "sonner";
import { P as PostCard } from "./post-card-Ctz1oU3z.mjs";
import { AlertDialog as AlertDialog$1 } from "@base-ui/react/alert-dialog";
import { B as Button } from "./button-IvqLSGSY.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { ContextMenu as ContextMenu$1 } from "@base-ui/react/context-menu";
import "@tiptap/pm/state";
import "./scroll-area-BzCNRtjT.mjs";
import "@base-ui/react/scroll-area";
import "@base-ui/react/merge-props";
import "@base-ui/react/use-render";
import "class-variance-authority";
import "@base-ui/react/dialog";
import "@base-ui/react/tooltip";
import "@base-ui/react/avatar";
import "@base-ui/react/menu";
import "./auth-client-BQ73uQ-S.mjs";
import "./auth-BaGll2Xr.mjs";
import "drizzle-orm";
import "zod";
import "./db-a0rvcoi6.mjs";
import "drizzle-orm/node-postgres";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
import "next-themes";
import "./dayjs-Bfb-Qhhu.mjs";
import "dayjs";
import "dayjs/plugin/relativeTime.js";
import "@base-ui/react/button";
import "clsx";
import "tailwind-merge";
function AlertDialog({ ...props }) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({ ...props }) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Portal, {
    "data-slot": "alert-dialog-portal",
    ...props,
  });
}
function AlertDialogOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Backdrop, {
    "data-slot": "alert-dialog-overlay",
    className: cn(
      "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50",
      className,
    ),
    ...props,
  });
}
function AlertDialogContent({ className, size = "default", ...props }) {
  return /* @__PURE__ */ jsxs(AlertDialogPortal, {
    children: [
      /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
      /* @__PURE__ */ jsx(AlertDialog$1.Popup, {
        "data-slot": "alert-dialog-content",
        "data-size": size,
        className: cn(
          "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background ring-foreground/5 gap-6 rounded-4xl p-6 ring-1 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          className,
        ),
        ...props,
      }),
    ],
  });
}
function AlertDialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", {
    "data-slot": "alert-dialog-header",
    className: cn(
      "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
      className,
    ),
    ...props,
  });
}
function AlertDialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", {
    "data-slot": "alert-dialog-footer",
    className: cn(
      "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
      className,
    ),
    ...props,
  });
}
function AlertDialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Title, {
    "data-slot": "alert-dialog-title",
    className: cn(
      "text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
      className,
    ),
    ...props,
  });
}
function AlertDialogDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Description, {
    "data-slot": "alert-dialog-description",
    className: cn(
      "text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3",
      className,
    ),
    ...props,
  });
}
function AlertDialogCancel({ className, variant = "outline", size = "default", ...props }) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Close, {
    "data-slot": "alert-dialog-cancel",
    className: cn(className),
    render: /* @__PURE__ */ jsx(Button, { variant, size }),
    ...props,
  });
}
function ContextMenu({ ...props }) {
  return /* @__PURE__ */ jsx(ContextMenu$1.Root, { "data-slot": "context-menu", ...props });
}
function ContextMenuTrigger({ className, ...props }) {
  return /* @__PURE__ */ jsx(ContextMenu$1.Trigger, {
    "data-slot": "context-menu-trigger",
    className: cn("select-none", className),
    ...props,
  });
}
function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(ContextMenu$1.Portal, {
    children: /* @__PURE__ */ jsx(ContextMenu$1.Positioner, {
      className: "isolate z-50 outline-none",
      align,
      alignOffset,
      side,
      sideOffset,
      children: /* @__PURE__ */ jsx(ContextMenu$1.Popup, {
        "data-slot": "context-menu-content",
        className: cn(
          "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 bg-popover text-popover-foreground min-w-48 rounded-2xl p-1 shadow-2xl ring-1 duration-100 dark z-50 max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none",
          className,
        ),
        ...props,
      }),
    }),
  });
}
function ContextMenuItem({ className, inset, variant = "default", ...props }) {
  return /* @__PURE__ */ jsx(ContextMenu$1.Item, {
    "data-slot": "context-menu-item",
    "data-inset": inset,
    "data-variant": variant,
    className: cn(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive focus:*:[svg]:text-accent-foreground gap-2.5 rounded-xl px-3 py-2 text-sm [&_svg:not([class*='size-'])]:size-4 group/context-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    ...props,
  });
}
function PostCardLoader() {
  const id = useId();
  return /* @__PURE__ */ jsxs(ContentLoader, {
    uniqueKey: id,
    viewBox: "0 0 400 300",
    className: "w-full 2xl:max-w-xs",
    backgroundColor: "var(--secondary)",
    foregroundColor: "var(--background)",
    children: [
      /* @__PURE__ */ jsx("rect", {
        x: "0",
        y: "0",
        rx: "8",
        ry: "8",
        width: "400",
        height: "200",
      }),
      /* @__PURE__ */ jsx("rect", {
        x: "0",
        y: "215",
        rx: "4",
        ry: "4",
        width: "300",
        height: "16",
      }),
      /* @__PURE__ */ jsx("rect", {
        x: "0",
        y: "240",
        rx: "4",
        ry: "4",
        width: "400",
        height: "12",
      }),
      /* @__PURE__ */ jsx("rect", {
        x: "0",
        y: "260",
        rx: "4",
        ry: "4",
        width: "400",
        height: "12",
      }),
      /* @__PURE__ */ jsx("rect", {
        x: "0",
        y: "280",
        rx: "4",
        ry: "4",
        width: "200",
        height: "10",
      }),
    ],
  });
}
function PostsLoader() {
  return /* @__PURE__ */ jsx("div", {
    className: "posts pb-4",
    children: /* @__PURE__ */ jsxs("div", {
      className:
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:flex 2xl:flex-wrap gap-4",
      children: [
        /* @__PURE__ */ jsx(PostCardLoader, {}),
        /* @__PURE__ */ jsx(PostCardLoader, {}),
        /* @__PURE__ */ jsx(PostCardLoader, {}),
        /* @__PURE__ */ jsx(PostCardLoader, {}),
        /* @__PURE__ */ jsx(PostCardLoader, {}),
        /* @__PURE__ */ jsx(PostCardLoader, {}),
        /* @__PURE__ */ jsx(PostCardLoader, {}),
        /* @__PURE__ */ jsx(PostCardLoader, {}),
      ],
    }),
  });
}
function Posts() {
  const [deletePostId, setDeletePostId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const {
    data: posts,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryFn() {
      return parseResponse(hono.api.posts.$get());
    },
    queryKey: ["posts"],
  });
  async function handleDelete(postId) {
    try {
      const res = await parseResponse(
        hono.api.posts[":id"].$delete({
          param: {
            id: postId,
          },
        }),
      );
      if (res.data.id) {
        toast.success("Post deleted");
        setConfirmDialogOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post");
    } finally {
      setDeletePostId(null);
    }
  }
  function handleSelectDeletePost(id) {
    setDeletePostId(id);
    setConfirmDialogOpen(true);
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx(PostsLoader, {});
  }
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx("div", {
        className: "posts pb-4",
        children: /* @__PURE__ */ jsx("div", {
          className: cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:flex 2xl:flex-wrap gap-4",
            isFetching && "opacity-80",
          ),
          children: posts?.data.map((post) => {
            return /* @__PURE__ */ jsxs(
              ContextMenu,
              {
                children: [
                  /* @__PURE__ */ jsx(ContextMenuTrigger, {
                    render: /* @__PURE__ */ jsx(Link, {
                      to: "/studio/posts/upsert/$id",
                      params: { id: post.id },
                      className: "block 2xl:w-xs",
                      children: /* @__PURE__ */ jsx(PostCard, { className: "h-full", post }),
                    }),
                  }),
                  /* @__PURE__ */ jsx(ContextMenuContent, {
                    children: /* @__PURE__ */ jsxs(ContextMenuItem, {
                      onClick: () => handleSelectDeletePost(post.id),
                      children: [/* @__PURE__ */ jsx(Trash2Icon, {}), "Delete"],
                    }),
                  }),
                ],
              },
              post.id,
            );
          }),
        }),
      }),
      /* @__PURE__ */ jsx(AlertDialog, {
        open: confirmDialogOpen,
        onOpenChange: setConfirmDialogOpen,
        children: /* @__PURE__ */ jsxs(AlertDialogContent, {
          children: [
            /* @__PURE__ */ jsxs(AlertDialogHeader, {
              children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Are you sure?" }),
                /* @__PURE__ */ jsx(AlertDialogDescription, {
                  children: "This action cannot be undone. This will permanently delete the post.",
                }),
              ],
            }),
            /* @__PURE__ */ jsxs(AlertDialogFooter, {
              children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsx(Button, {
                  onClick: () => deletePostId && handleDelete(deletePostId),
                  children: "Delete",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
function PostsCreateButton() {
  const navigate = useNavigate();
  async function handleCreate() {
    try {
      const res = await parseResponse(
        hono.api.posts.$post({
          json: {},
        }),
      );
      if (res.data.id) {
        navigate({ to: "/studio/posts/upsert/$id", params: { id: res.data.id } });
      }
    } catch (err) {
      console.error("Failed to create post", err);
      toast.error("Failed to create post");
    }
  }
  return /* @__PURE__ */ jsx(Button, { onClick: handleCreate, children: "New Post" });
}
function PostsRefreshButton() {
  const queryClient = useQueryClient();
  async function handleRefresh() {
    return queryClient.invalidateQueries({ queryKey: ["posts"] });
  }
  return /* @__PURE__ */ jsx(Button, {
    onClick: handleRefresh,
    variant: "secondary",
    children: "Refresh",
  });
}
function StudioPostsPage() {
  return /* @__PURE__ */ jsx(StudioShell, {
    children: /* @__PURE__ */ jsxs(AdminContainer, {
      className: "space-y-4",
      children: [
        /* @__PURE__ */ jsxs("div", {
          className: "flex gap-4",
          children: [
            /* @__PURE__ */ jsx(PostsCreateButton, {}),
            /* @__PURE__ */ jsx(PostsRefreshButton, {}),
          ],
        }),
        /* @__PURE__ */ jsx(Posts, {}),
      ],
    }),
  });
}
export { StudioPostsPage as component };
