import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  g as getCommentsServerFn,
  c as createCommentServerFn,
  a as Route,
} from "./router-CV8uKWT2.mjs";
import { ArrowUpIcon, Calendar } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  I as InputGroup,
  a as InputGroupTextarea,
  b as InputGroupAddon,
  c as InputGroupButton,
} from "./bookmark-node-CwOinFNs.mjs";
import { S as Separator } from "./separator-k6ZM8qvW.mjs";
import { a as authClient } from "./auth-client-BQ73uQ-S.mjs";
import "./dayjs-Bfb-Qhhu.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { B as Button } from "./button-IvqLSGSY.mjs";
import { P as PageContainer } from "./page-container-DVzgPATo.mjs";
import { Link } from "@tanstack/react-router";
import { useIsClient } from "foxact/use-is-client";
import { useInView } from "motion/react";
import "next-themes";
import "../server.mjs";
import "node:async_hooks";
import "node:stream";
import "@tanstack/react-router/ssr/server";
import "zod";
import "hono";
import "hono/cors";
import "./auth-BaGll2Xr.mjs";
import "drizzle-orm";
import "./db-a0rvcoi6.mjs";
import "drizzle-orm/node-postgres";
import "@paralleldrive/cuid2";
import "drizzle-orm/pg-core";
import "@t3-oss/env-core";
import "zod/v4-mini";
import "hono/factory";
import "@aws-sdk/client-s3";
import "@hono/zod-validator";
import "@aws-sdk/s3-request-presigner";
import "class-variance-authority";
import "@base-ui/react/input";
import "@base-ui/react/separator";
import "dayjs/plugin/relativeTime.js";
import "clsx";
import "tailwind-merge";
import "@base-ui/react/button";
async function getComments(postId) {
  return getCommentsServerFn({
    data: {
      postId,
    },
  });
}
async function createComment(data) {
  return createCommentServerFn({
    data,
  });
}
function CommentsInput({ id }) {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [isPending, setIsPending] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);
    const inputComment = comment;
    if (comment.trim().length === 0) {
      toast.info("请输入评论");
      setIsPending(false);
      return;
    }
    if (!data?.user) {
      toast.info("请登陆后评论");
      setComment("");
      setIsPending(false);
      return;
    }
    const create = {
      postId: id,
      content: inputComment,
    };
    try {
      await createComment(create);
      toast.success("评论成功");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    } catch (e2) {
      console.error(e2);
      toast.error("评论失败");
    } finally {
      setIsPending(false);
    }
  }
  return /* @__PURE__ */ jsx("div", {
    className: "comment-input rounded-xl",
    children: /* @__PURE__ */ jsx("div", {
      className: "pt-4 relative",
      children: /* @__PURE__ */ jsx("form", {
        onSubmit: handleSubmit,
        children: /* @__PURE__ */ jsxs(InputGroup, {
          className: "[--radius:16px] pt-2",
          children: [
            /* @__PURE__ */ jsx(InputGroupTextarea, {
              name: "comment",
              value: comment,
              onChange: (e) => setComment(e.target.value),
              disabled: isPending,
              placeholder: "评论文章是免费的...",
            }),
            /* @__PURE__ */ jsxs(InputGroupAddon, {
              align: "block-end",
              children: [
                /* @__PURE__ */ jsx(Separator, {
                  className: "flex-1 bg-transparent",
                  orientation: "vertical",
                }),
                /* @__PURE__ */ jsx(InputGroupButton, {
                  type: "submit",
                  disabled: isPending,
                  variant: "default",
                  className: "rounded-full",
                  size: "icon-sm",
                  children: /* @__PURE__ */ jsx(ArrowUpIcon, { className: "size-5" }),
                }),
              ],
            }),
          ],
        }),
      }),
    }),
  });
}
function CommentsList({ list }) {
  const { data } = authClient.useSession();
  return /* @__PURE__ */ jsx("div", {
    className: cn("comment-list w-full my-12!"),
    children: /* @__PURE__ */ jsx("div", {
      children: list.map((comment, index) => {
        return /* @__PURE__ */ jsx(
          CommentsListItem,
          { user: data?.user, index, comment },
          comment.id,
        );
      }),
    }),
  });
}
function CommentsListItem({ comment, index, user }) {
  const isSelfComment = comment.userId === user?.id;
  const createdAt = dayjs(comment.createdAt);
  function formatNow(date) {
    if (!date) {
      return "-";
    }
    return createdAt.fromNow();
  }
  return /* @__PURE__ */ jsxs("div", {
    className: cn("comment-list-item gap-4 flex items-end mb-4! ", {
      "flex-row-reverse": isSelfComment,
    }),
    children: [
      /* @__PURE__ */ jsx("div", {
        className: "shrink-0",
        children: /* @__PURE__ */ jsx("img", {
          className: "rounded-full size-8",
          src: comment.user?.image || "/default-avatar.svg",
          alt: "avatar",
        }),
      }),
      /* @__PURE__ */ jsxs("div", {
        className: cn({
          "text-right": isSelfComment,
        }),
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "pl-1 space-x-2 pb-1 ",
            children: [
              /* @__PURE__ */ jsx("span", {
                className: "text-sm font-bold",
                children: comment.user?.name,
              }),
              /* @__PURE__ */ jsxs("span", {
                className: "text-gray-500 text-[10px]",
                children: ["#", index + 1, " ", createdAt?.format("YYYY-MM-DD HH:mm:ss")],
              }),
              /* @__PURE__ */ jsx("span", {
                className: "text-gray-500 text-[10px]",
                children: formatNow(comment.createdAt),
              }),
            ],
          }),
          /* @__PURE__ */ jsx("p", {
            className: cn("inline-block text-left text-sm bg-gray-100 p-2", [
              isSelfComment ? "rounded-t-xl rounded-bl-xl" : "rounded-t-xl rounded-br-xl",
            ]),
            children: comment.content,
          }),
        ],
      }),
    ],
  });
}
function CommentsMask({ children }) {
  const { data, isPending } = authClient.useSession();
  function githubSignIn() {
    authClient.signIn.social({
      provider: "github",
      callbackURL: location.href,
    });
  }
  if (data?.user || isPending) {
    return children;
  }
  return /* @__PURE__ */ jsxs("div", {
    className: " relative w-full  border border-gray-50 rounded-md p-2",
    children: [
      /* @__PURE__ */ jsx("div", {
        className: "absolute z-10 top-0 left-0 h-full w-full bg-white/20 backdrop-blur-sm",
        children: /* @__PURE__ */ jsx("div", {
          className: "h-full w-full flex justify-center items-center",
          children: /* @__PURE__ */ jsxs("div", {
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "text-sm text-center pb-4",
                children: [
                  /* @__PURE__ */ jsx("p", {
                    className: "mb-2!",
                    children: "使用社交账户登录评论",
                  }),
                  /* @__PURE__ */ jsxs("p", {
                    className: "text-xs",
                    children: [
                      "如果你没有以下社交帐户，你可以给我",
                      /* @__PURE__ */ jsx("a", {
                        className: "text-black underline",
                        href: "mailto:wisakura@outlook.com",
                        children: "写信",
                      }),
                      "交流",
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsx("div", {
                className: "flex p items-center justify-center gap-4",
                children: /* @__PURE__ */ jsxs(Button, {
                  onClick: githubSignIn,
                  children: [
                    /* @__PURE__ */ jsx(Icon, {
                      className: "mr-1 size-4.5",
                      fill: "#fff",
                      icon: "ri:github-fill",
                    }),
                    "Github",
                  ],
                }),
              }),
            ],
          }),
        }),
      }),
      children,
    ],
  });
}
function Comments(props) {
  const { id, initialComments } = props;
  const { data } = useQuery({
    queryKey: ["comments", id],
    initialData: initialComments,
    queryFn() {
      return getComments(id);
    },
  });
  return /* @__PURE__ */ jsxs("div", {
    className: "comment w-full pb-24",
    children: [
      /* @__PURE__ */ jsx(CommentsList, { list: data || [] }),
      /* @__PURE__ */ jsx(CommentsMask, { children: /* @__PURE__ */ jsx(CommentsInput, { id }) }),
    ],
  });
}
function PostHeader() {
  const ref = useRef(null);
  const inView = useInView(ref);
  const isClient = useIsClient();
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx("div", {
        className: cn(
          "fixed top-0 z-10 left-0  w-full bg-background/90 backdrop-blur-md transition-all ",
          inView || !isClient ? "opacity-0 invisible " : "visible opacity-100 ",
        ),
        children: /* @__PURE__ */ jsxs("div", {
          className: cn(
            "mx-auto max-w-2xl flex relative items-center justify-between py-0.5 px-4   ",
          ),
          children: [
            /* @__PURE__ */ jsx(Link, {
              to: "/blog",
              className: "p-1 invisible md:visible",
              children: /* @__PURE__ */ jsx(Button, {
                size: "icon",
                className: "rounded-full",
                variant: "ghost",
                children: /* @__PURE__ */ jsx(Icon, {
                  className: "text-xl size-4",
                  icon: "ri:arrow-left-line",
                }),
              }),
            }),
            /* @__PURE__ */ jsx("span", {
              className: "text-sm font-bold",
              children: isClient ? document?.title.replace("- akumanoko", "") : "",
            }),
            /* @__PURE__ */ jsx("span", { className: "size-6" }),
          ],
        }),
      }),
      /* @__PURE__ */ jsx("div", {
        className: "mb-12",
        ref,
        children: /* @__PURE__ */ jsx(Link, {
          to: "/blog",
          children: /* @__PURE__ */ jsx(Button, {
            size: "icon",
            variant: "secondary",
            className: " rounded-full text-xl ",
            children: /* @__PURE__ */ jsx(Icon, { icon: "ri:arrow-left-line" }),
          }),
        }),
      }),
    ],
  });
}
function PostContent({ post }) {
  const createdAt = post?.createdAt ? dayjs(post.createdAt).format("YYYY年MM月DD日") : "-";
  return /* @__PURE__ */ jsxs("div", {
    className: "post-content ",
    children: [
      post?.banner
        ? /* @__PURE__ */ jsxs("div", {
            className: "mb-8  aspect-16/10  rounded-3xl relative pointer-events-none *:select-none",
            children: [
              /* @__PURE__ */ jsx("img", {
                className: "object-cover aspect-16/10 rounded-3xl relative z-2",
                src: post.banner,
              }),
              /* @__PURE__ */ jsx("img", {
                className:
                  "object-cover aspect-16/10 rounded-3xl absolute opacity-65 top-0  left-0 blur-xl z-1",
                src: post.banner,
              }),
            ],
          })
        : null,
      /* @__PURE__ */ jsxs("div", {
        className: "mt-12 mb-8",
        children: [
          /* @__PURE__ */ jsx("h1", {
            className: "mb-6 text-4xl font-bold",
            children: post?.title,
          }),
          /* @__PURE__ */ jsxs("p", {
            className: "flex items-center gap-8 opacity-80 text-sm",
            children: [
              /* @__PURE__ */ jsxs("span", {
                className: "flex items-center gap-1",
                children: [/* @__PURE__ */ jsx(Calendar, { className: "size-4" }), "创建时间"],
              }),
              /* @__PURE__ */ jsx("span", { children: createdAt }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx("div", {
          className: "tiptap ProseMirror",
          dangerouslySetInnerHTML: {
            __html: post?.htmlContent || "",
          },
        }),
      }),
    ],
  });
}
function BlogDetailPage() {
  const { id } = Route.useParams();
  const { post, comments } = Route.useLoaderData();
  return /* @__PURE__ */ jsxs(PageContainer, {
    className: "pt-12 px-4 max-w-2xl mx-auto",
    children: [
      /* @__PURE__ */ jsx(PostHeader, {}),
      /* @__PURE__ */ jsx(PostContent, { post }),
      /* @__PURE__ */ jsx(Comments, { id, initialComments: comments }),
    ],
  });
}
export { BlogDetailPage as component };
