import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import {
  h as hono,
  p as parseShortcutKeys,
  c as cn,
  i as isNodeInSchema,
  a as isNodeTypeSelected,
  f as findNodePosition,
  b as isValidPosition,
  u as useIsMobile,
  d as isMarkInSchema,
  e as isExtensionAvailable,
  s as sanitizeUrl,
  g as focusNextNode,
  j as handleImageUpload,
  M as MAX_FILE_SIZE,
  S as StudioShell,
  A as AdminContainer,
} from "./studio-shell-XAoOk8iz.mjs";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { parseResponse } from "hono/client";
import { throttle, isNil } from "lodash-es";
import {
  CornerDownLeftIcon as CornerDownLeftIcon$1,
  ChevronDownIcon as ChevronDownIcon$1,
  Sparkles,
} from "lucide-react";
import * as React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import {
  useCurrentEditor,
  useEditorState,
  EditorContext,
  EditorContent,
  NodeViewWrapper,
  Node,
  ReactNodeViewRenderer,
  mergeAttributes,
  useEditor as useEditor$1,
} from "@tiptap/react";
import {
  FloatingDelayGroup,
  useMergeRefs,
  FloatingPortal,
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import { TextSelection, NodeSelection } from "@tiptap/pm/state";
import { Popover as Popover$1 } from "@base-ui/react/popover";
import { c as cn$1 } from "./utils-H80jjgLf.mjs";
import { Menu } from "@base-ui/react/menu";
import {
  I as InputGroup$1,
  d as InputGroupInput,
  a as InputGroupTextarea,
  b as InputGroupAddon,
} from "./bookmark-node-CwOinFNs.mjs";
import { b as Route } from "./router-CV8uKWT2.mjs";
import { B as Button$1, S as Spinner } from "./button-IvqLSGSY.mjs";
import {
  d as FieldSet,
  F as FieldGroup,
  a as Field,
  b as FieldLabel,
  e as FieldError,
} from "./field-BdRzanoA.mjs";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";
import TiptapHorizontalRule from "@tiptap/extension-horizontal-rule";
import "./scroll-area-BzCNRtjT.mjs";
import "@base-ui/react/scroll-area";
import "@base-ui/react/merge-props";
import "@base-ui/react/use-render";
import "class-variance-authority";
import "@base-ui/react/dialog";
import "@base-ui/react/tooltip";
import "@base-ui/react/avatar";
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
import "clsx";
import "tailwind-merge";
import "./separator-k6ZM8qvW.mjs";
import "@base-ui/react/input";
import "@base-ui/react/separator";
import "../server.mjs";
import "node:async_hooks";
import "node:stream";
import "@tanstack/react-router/ssr/server";
import "hono";
import "hono/cors";
import "hono/factory";
import "@aws-sdk/client-s3";
import "@hono/zod-validator";
import "@aws-sdk/s3-request-presigner";
import "@base-ui/react/button";
async function uploadFileToR2(file) {
  const response = await hono.api.s3["presigned-url"].$post({
    json: {
      fileName: file.name,
      fileType: file.type,
    },
  });
  if (!response.ok) {
    throw new Error("获取上传链接失败");
  }
  const data = await response.json();
  if (!data.success) {
    const errorMsg =
      "error" in data && typeof data.error === "string" ? data.error : "获取上传链接失败";
    throw new Error(errorMsg);
  }
  const { uploadUrl, fileUrl } = data;
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  if (!uploadResponse.ok) {
    throw new Error("文件上传失败");
  }
  return fileUrl;
}
const CloudUploadIcon$1 = () =>
  /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    className: "banner-upload-icon",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M11.1953 4.41771C10.3478 4.08499 9.43578 3.94949 8.5282 4.02147C7.62062 4.09345 6.74133 4.37102 5.95691 4.83316C5.1725 5.2953 4.50354 5.92989 4.00071 6.68886C3.49788 7.44783 3.17436 8.31128 3.05465 9.2138C2.93495 10.1163 3.0222 11.0343 3.3098 11.8981C3.5974 12.7619 4.07781 13.5489 4.71463 14.1995C5.10094 14.5942 5.09414 15.2274 4.69945 15.6137C4.30476 16 3.67163 15.9932 3.28532 15.5985C2.43622 14.731 1.79568 13.6816 1.41221 12.5299C1.02875 11.3781 0.91241 10.1542 1.07201 8.95084C1.23162 7.74748 1.66298 6.59621 2.33343 5.58425C3.00387 4.57229 3.89581 3.72617 4.9417 3.10998C5.98758 2.4938 7.15998 2.1237 8.37008 2.02773C9.58018 1.93176 10.7963 2.11243 11.9262 2.55605C13.0561 2.99968 14.0703 3.69462 14.8919 4.58825C15.5423 5.29573 16.0585 6.11304 16.4177 7.00002H17.4999C18.6799 6.99991 19.8288 7.37933 20.7766 8.08222C21.7245 8.78515 22.4212 9.7743 22.7637 10.9036C23.1062 12.0328 23.0765 13.2423 22.6788 14.3534C22.2812 15.4644 21.5367 16.4181 20.5554 17.0736C20.0962 17.3803 19.4752 17.2567 19.1684 16.7975C18.8617 16.3382 18.9853 15.7172 19.4445 15.4105C20.069 14.9934 20.5427 14.3865 20.7958 13.6794C21.0488 12.9724 21.0678 12.2027 20.8498 11.4841C20.6318 10.7655 20.1885 10.136 19.5853 9.6887C18.9821 9.24138 18.251 8.99993 17.5001 9.00002H15.71C15.2679 9.00002 14.8783 8.70973 14.7518 8.28611C14.4913 7.41374 14.0357 6.61208 13.4195 5.94186C12.8034 5.27164 12.0427 4.75043 11.1953 4.41771Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M11 14.4142V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V14.4142L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L12.7078 11.2936C12.7054 11.2912 12.703 11.2888 12.7005 11.2864C12.5208 11.1099 12.2746 11.0008 12.003 11L12 11L11.997 11C11.8625 11.0004 11.7343 11.0273 11.6172 11.0759C11.502 11.1236 11.3938 11.1937 11.2995 11.2864C11.297 11.2888 11.2946 11.2912 11.2922 11.2936L7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071C7.68342 17.0976 8.31658 17.0976 8.70711 16.7071L11 14.4142Z",
        fill: "currentColor",
      }),
    ],
  });
const FileIcon$1 = () =>
  /* @__PURE__ */ jsx("svg", {
    width: "43",
    height: "57",
    viewBox: "0 0 43 57",
    fill: "currentColor",
    className: "banner-upload-dropzone-rect-primary",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", {
      d: "M0.75 10.75C0.75 5.64137 4.89137 1.5 10 1.5H32.3431C33.2051 1.5 34.0317 1.84241 34.6412 2.4519L40.2981 8.10876C40.9076 8.71825 41.25 9.5449 41.25 10.4069V46.75C41.25 51.8586 37.1086 56 32 56H10C4.89137 56 0.75 51.8586 0.75 46.75V10.75Z",
      fill: "currentColor",
      fillOpacity: "0.11",
      stroke: "currentColor",
      strokeWidth: "1.5",
    }),
  });
const FileCornerIcon$1 = () =>
  /* @__PURE__ */ jsx("svg", {
    width: "10",
    height: "10",
    className: "banner-upload-dropzone-rect-secondary",
    viewBox: "0 0 10 10",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", {
      d: "M0 0.75H0.343146C1.40401 0.75 2.42143 1.17143 3.17157 1.92157L8.82843 7.57843C9.57857 8.32857 10 9.34599 10 10.4069V10.75H4C1.79086 10.75 0 8.95914 0 6.75V0.75Z",
      fill: "currentColor",
    }),
  });
function BannerUpload({ value, onChange, onError }) {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewUrl, setPreviewUrl] = React.useState(value);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    setPreviewUrl(value);
  }, [value]);
  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      onError?.(new Error("Please select an image file"));
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      onError?.(new Error("File size must be less than 5MB"));
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      const url = await uploadFileToR2(file);
      setProgress(100);
      setPreviewUrl(url);
      onChange?.(url);
      URL.revokeObjectURL(localPreview);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload failed");
      onError?.(error);
      setPreviewUrl(value);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragActive(false);
      setIsDragOver(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  const handleClick = () => {
    if (!uploading && !previewUrl) {
      inputRef.current?.click();
    }
  };
  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(void 0);
    onChange?.("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "banner-upload",
    children: [
      !previewUrl
        ? /* @__PURE__ */ jsxs("div", {
            className: `banner-upload-drag-area ${isDragActive ? "drag-active" : ""} ${isDragOver ? "drag-over" : ""}`,
            onDragEnter: handleDragEnter,
            onDragLeave: handleDragLeave,
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            onClick: handleClick,
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "banner-upload-dropzone",
                children: [
                  /* @__PURE__ */ jsx(FileIcon$1, {}),
                  /* @__PURE__ */ jsx(FileCornerIcon$1, {}),
                  /* @__PURE__ */ jsx("div", {
                    className: "banner-upload-icon-container",
                    children: /* @__PURE__ */ jsx(CloudUploadIcon$1, {}),
                  }),
                ],
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "banner-upload-content",
                children: [
                  /* @__PURE__ */ jsxs("span", {
                    className: "banner-upload-text",
                    children: [
                      /* @__PURE__ */ jsx("em", { children: "Click to upload" }),
                      " ",
                      "or drag and drop",
                    ],
                  }),
                  /* @__PURE__ */ jsx("span", {
                    className: "banner-upload-subtext",
                    children: "PNG, JPG, GIF up to 5MB",
                  }),
                ],
              }),
            ],
          })
        : /* @__PURE__ */ jsxs("div", {
            className: "banner-upload-preview",
            children: [
              uploading &&
                /* @__PURE__ */ jsx("div", {
                  className: "banner-upload-progress",
                  style: { width: `${progress}%` },
                }),
              /* @__PURE__ */ jsxs("div", {
                className: "banner-upload-preview-content",
                children: [
                  /* @__PURE__ */ jsx("img", {
                    src: previewUrl,
                    alt: "Banner preview",
                    className: "banner-upload-image",
                  }),
                  !uploading &&
                    /* @__PURE__ */ jsx("button", {
                      type: "button",
                      onClick: handleRemove,
                      className: "banner-upload-remove",
                      "aria-label": "Remove banner",
                      children: /* @__PURE__ */ jsxs("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M18 6 6 18" }),
                          /* @__PURE__ */ jsx("path", { d: "m6 6 12 12" }),
                        ],
                      }),
                    }),
                ],
              }),
            ],
          }),
      /* @__PURE__ */ jsx("input", {
        ref: inputRef,
        type: "file",
        accept: "image/*",
        onChange: handleFileChange,
        disabled: uploading,
        className: "hidden",
        "aria-label": "Upload banner",
      }),
    ],
  });
}
const ArrowLeftIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      d: "M12.7071 5.70711C13.0976 5.31658 13.0976 4.68342 12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L4.29289 11.2929C3.90237 11.6834 3.90237 12.3166 4.29289 12.7071L11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071C13.0976 19.3166 13.0976 18.6834 12.7071 18.2929L7.41421 13L19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11L7.41421 11L12.7071 5.70711Z",
      fill: "currentColor",
    }),
  });
});
ArrowLeftIcon.displayName = "ArrowLeftIcon";
const HighlighterIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14.7072 4.70711C15.0977 4.31658 15.0977 3.68342 14.7072 3.29289C14.3167 2.90237 13.6835 2.90237 13.293 3.29289L8.69294 7.89286L8.68594 7.9C8.13626 8.46079 7.82837 9.21474 7.82837 10C7.82837 10.2306 7.85491 10.4584 7.90631 10.6795L2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17V20C2 20.5523 2.44772 21 3 21H12C12.2652 21 12.5196 20.8946 12.7071 20.7071L15.3205 18.0937C15.5416 18.1452 15.7695 18.1717 16.0001 18.1717C16.7853 18.1717 17.5393 17.8639 18.1001 17.3142L22.7072 12.7071C23.0977 12.3166 23.0977 11.6834 22.7072 11.2929C22.3167 10.9024 21.6835 10.9024 21.293 11.2929L16.6971 15.8887C16.5105 16.0702 16.2605 16.1717 16.0001 16.1717C15.7397 16.1717 15.4897 16.0702 15.303 15.8887L10.1113 10.697C9.92992 10.5104 9.82837 10.2604 9.82837 10C9.82837 9.73963 9.92992 9.48958 10.1113 9.30297L14.7072 4.70711ZM13.5858 17L9.00004 12.4142L4 17.4142V19H11.5858L13.5858 17Z",
      fill: "currentColor",
    }),
  });
});
HighlighterIcon.displayName = "HighlighterIcon";
const LinkIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M16.9958 1.06669C15.4226 1.05302 13.907 1.65779 12.7753 2.75074L12.765 2.76086L11.045 4.47086C10.6534 4.86024 10.6515 5.49341 11.0409 5.88507C11.4303 6.27673 12.0634 6.27858 12.4551 5.88919L14.1697 4.18456C14.9236 3.45893 15.9319 3.05752 16.9784 3.06662C18.0272 3.07573 19.0304 3.49641 19.772 4.23804C20.5137 4.97967 20.9344 5.98292 20.9435 7.03171C20.9526 8.07776 20.5515 9.08563 19.8265 9.83941L16.833 12.8329C16.4274 13.2386 15.9393 13.5524 15.4019 13.7529C14.8645 13.9533 14.2903 14.0359 13.7181 13.9949C13.146 13.9539 12.5894 13.7904 12.0861 13.5154C11.5827 13.2404 11.1444 12.8604 10.8008 12.401C10.47 11.9588 9.84333 11.8685 9.40108 12.1993C8.95883 12.5301 8.86849 13.1568 9.1993 13.599C9.71464 14.288 10.3721 14.858 11.1272 15.2705C11.8822 15.683 12.7171 15.9283 13.5753 15.9898C14.4334 16.0513 15.2948 15.9274 16.1009 15.6267C16.907 15.326 17.639 14.8555 18.2473 14.247L21.2472 11.2471L21.2593 11.2347C22.3523 10.1031 22.9571 8.58751 22.9434 7.01433C22.9297 5.44115 22.2987 3.93628 21.1863 2.82383C20.0738 1.71138 18.5689 1.08036 16.9958 1.06669Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M10.4247 8.0102C9.56657 7.94874 8.70522 8.07256 7.89911 8.37326C7.09305 8.67395 6.36096 9.14458 5.75272 9.753L2.75285 12.7529L2.74067 12.7653C1.64772 13.8969 1.04295 15.4125 1.05662 16.9857C1.07029 18.5589 1.70131 20.0637 2.81376 21.1762C3.9262 22.2886 5.43108 22.9196 7.00426 22.9333C8.57744 22.947 10.0931 22.3422 11.2247 21.2493L11.2371 21.2371L12.9471 19.5271C13.3376 19.1366 13.3376 18.5034 12.9471 18.1129C12.5565 17.7223 11.9234 17.7223 11.5328 18.1129L9.82932 19.8164C9.07555 20.5414 8.06768 20.9425 7.02164 20.9334C5.97285 20.9243 4.9696 20.5036 4.22797 19.762C3.48634 19.0203 3.06566 18.0171 3.05655 16.9683C3.04746 15.9222 3.44851 14.9144 4.17355 14.1606L7.16719 11.167C7.5727 10.7613 8.06071 10.4476 8.59811 10.2471C9.13552 10.0467 9.70976 9.96412 10.2819 10.0051C10.854 10.0461 11.4106 10.2096 11.9139 10.4846C12.4173 10.7596 12.8556 11.1397 13.1992 11.599C13.53 12.0412 14.1567 12.1316 14.5989 11.8007C15.0412 11.4699 15.1315 10.8433 14.8007 10.401C14.2854 9.71205 13.6279 9.14198 12.8729 8.72948C12.1178 8.31697 11.2829 8.07166 10.4247 8.0102Z",
        fill: "currentColor",
      }),
    ],
  });
});
LinkIcon.displayName = "LinkIcon";
function useTooltip({
  initialOpen = false,
  placement = "top",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  delay = 600,
  closeDelay = 0,
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "start",
        padding: 4,
      }),
      shift({ padding: 4 }),
    ],
  });
  const context = data.context;
  const hover = useHover(context, {
    mouseOnly: true,
    move: false,
    restMs: delay,
    enabled: controlledOpen == null,
    delay: {
      close: closeDelay,
    },
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const interactions = useInteractions([hover, focus, dismiss, role]);
  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  );
}
const TooltipContext = React.createContext(null);
function useTooltipContext() {
  const context = React.use(TooltipContext);
  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <TooltipProvider />");
  }
  return context;
}
function Tooltip({ children, ...props }) {
  const tooltip = useTooltip(props);
  if (!props.useDelayGroup) {
    return /* @__PURE__ */ jsx(TooltipContext, { value: tooltip, children });
  }
  return /* @__PURE__ */ jsx(FloatingDelayGroup, {
    delay: { open: props.delay ?? 0, close: props.closeDelay ?? 0 },
    timeoutMs: props.timeout,
    children: /* @__PURE__ */ jsx(TooltipContext, { value: tooltip, children }),
  });
}
function TooltipTrigger({ ref: propRef, children, asChild = false, ...props }) {
  const context = useTooltipContext();
  const childrenRef = React.isValidElement(children)
    ? Number.parseInt(React.version, 10) >= 19
      ? children.props.ref
      : children.ref
    : void 0;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
  if (asChild && React.isValidElement(children)) {
    const dataAttributes = {
      "data-tooltip-state": context.open ? "open" : "closed",
    };
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(typeof children.props === "object" ? children.props : {}),
        ...dataAttributes,
      }),
    );
  }
  return /* @__PURE__ */ jsx("button", {
    type: "button",
    ref,
    "data-tooltip-state": context.open ? "open" : "closed",
    ...context.getReferenceProps(props),
    children,
  });
}
const defaultPortalProps = {};
function TooltipContent({
  ref: propRef,
  style,
  children,
  portal = true,
  portalProps = defaultPortalProps,
  ...props
}) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  if (!context.open) return null;
  const content = /* @__PURE__ */ jsx("div", {
    ref,
    style: {
      ...context.floatingStyles,
      ...style,
    },
    ...context.getFloatingProps(props),
    className: "tiptap-tooltip",
    children,
  });
  if (portal) {
    return /* @__PURE__ */ jsx(FloatingPortal, { ...portalProps, children: content });
  }
  return content;
}
Tooltip.displayName = "Tooltip";
TooltipTrigger.displayName = "TooltipTrigger";
TooltipContent.displayName = "TooltipContent";
const ShortcutDisplay = ({ shortcuts }) => {
  if (shortcuts.length === 0) return null;
  return /* @__PURE__ */ jsx("div", {
    children: shortcuts.map((key, index) =>
      /* @__PURE__ */ jsxs(
        React.Fragment,
        {
          children: [
            index > 0 && /* @__PURE__ */ jsx("kbd", { children: "+" }),
            /* @__PURE__ */ jsx("kbd", { children: key }),
          ],
        },
        index,
      ),
    ),
  });
};
function Button({
  ref,
  className,
  children,
  tooltip,
  showTooltip = true,
  shortcutKeys,
  "aria-label": ariaLabel,
  ...props
}) {
  const shortcuts = React.useMemo(() => parseShortcutKeys({ shortcutKeys }), [shortcutKeys]);
  if (!tooltip || !showTooltip) {
    return /* @__PURE__ */ jsx("button", {
      className: cn("tiptap-button", className),
      ref,
      "aria-label": ariaLabel,
      type: "button",
      ...props,
      children,
    });
  }
  return /* @__PURE__ */ jsxs(Tooltip, {
    delay: 200,
    children: [
      /* @__PURE__ */ jsx(TooltipTrigger, {
        className: cn("tiptap-button", className),
        ref,
        "aria-label": ariaLabel,
        ...props,
        children,
      }),
      /* @__PURE__ */ jsxs(TooltipContent, {
        children: [tooltip, /* @__PURE__ */ jsx(ShortcutDisplay, { shortcuts })],
      }),
    ],
  });
}
Button.displayName = "Button";
function ButtonGroup({ ref, className, children, orientation = "vertical", ...props }) {
  return /* @__PURE__ */ jsx("div", {
    ref,
    className: cn("tiptap-button-group", className),
    "data-orientation": orientation,
    role: "group",
    ...props,
    children,
  });
}
ButtonGroup.displayName = "ButtonGroup";
const defaultStyle = {};
function Spacer({ orientation = "horizontal", size, style = defaultStyle, ...props }) {
  const computedStyle = {
    ...style,
    ...(orientation === "horizontal" && !size && { flex: 1 }),
    ...(size && {
      width: orientation === "vertical" ? "1px" : size,
      height: orientation === "horizontal" ? "1px" : size,
    }),
  };
  return /* @__PURE__ */ jsx("div", { ...props, style: computedStyle });
}
function Separator({ ref, decorative, orientation = "vertical", className, ...divProps }) {
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative
    ? { role: "none" }
    : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsx("div", {
    className: cn("tiptap-separator", className),
    "data-orientation": orientation,
    ...semanticProps,
    ...divProps,
    ref,
  });
}
Separator.displayName = "Separator";
function updateRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    ref.current = value;
  }
}
function useComposedRef(libRef, userRef) {
  const prevUserRef = React.useRef(null);
  return React.useCallback(
    (instance) => {
      if (libRef && "current" in libRef) {
        libRef.current = instance;
      }
      if (prevUserRef.current) {
        updateRef(prevUserRef.current, null);
      }
      prevUserRef.current = userRef;
      if (userRef) {
        updateRef(userRef, instance);
      }
    },
    [libRef, userRef],
  );
}
function useMenuNavigation({
  editor,
  containerRef,
  query,
  items,
  onSelect,
  onClose,
  orientation = "vertical",
  autoSelectFirstItem = true,
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(autoSelectFirstItem ? 0 : -1);
  React.useEffect(() => {
    const handleKeyboardNavigation = (event) => {
      if (!items.length) return false;
      const moveNext = () =>
        setSelectedIndex((currentIndex) => {
          if (currentIndex === -1) return 0;
          return (currentIndex + 1) % items.length;
        });
      const movePrev = () =>
        setSelectedIndex((currentIndex) => {
          if (currentIndex === -1) return items.length - 1;
          return (currentIndex - 1 + items.length) % items.length;
        });
      switch (event.key) {
        case "ArrowUp": {
          if (orientation === "horizontal") return false;
          event.preventDefault();
          movePrev();
          return true;
        }
        case "ArrowDown": {
          if (orientation === "horizontal") return false;
          event.preventDefault();
          moveNext();
          return true;
        }
        case "ArrowLeft": {
          if (orientation === "vertical") return false;
          event.preventDefault();
          movePrev();
          return true;
        }
        case "ArrowRight": {
          if (orientation === "vertical") return false;
          event.preventDefault();
          moveNext();
          return true;
        }
        case "Tab": {
          event.preventDefault();
          if (event.shiftKey) {
            movePrev();
          } else {
            moveNext();
          }
          return true;
        }
        case "Home": {
          event.preventDefault();
          setSelectedIndex(0);
          return true;
        }
        case "End": {
          event.preventDefault();
          setSelectedIndex(items.length - 1);
          return true;
        }
        case "Enter": {
          if (event.isComposing) return false;
          event.preventDefault();
          if (selectedIndex !== -1 && items[selectedIndex]) {
            onSelect?.(items[selectedIndex]);
          }
          return true;
        }
        case "Escape": {
          event.preventDefault();
          onClose?.();
          return true;
        }
        default:
          return false;
      }
    };
    let targetElement = null;
    if (editor) {
      targetElement = editor.view.dom;
    } else if (containerRef?.current) {
      targetElement = containerRef.current;
    }
    if (targetElement) {
      targetElement.addEventListener("keydown", handleKeyboardNavigation, true);
      return () => {
        targetElement?.removeEventListener("keydown", handleKeyboardNavigation, true);
      };
    }
    return void 0;
  }, [editor, containerRef, items, selectedIndex, onSelect, onClose, orientation]);
  React.useEffect(() => {
    if (query) {
      setSelectedIndex(autoSelectFirstItem ? 0 : -1);
    }
  }, [query, autoSelectFirstItem]);
  return {
    selectedIndex: items.length ? selectedIndex : void 0,
    setSelectedIndex,
  };
}
function useToolbarNavigation(toolbarRef) {
  const [items, setItems] = React.useState([]);
  const collectItems = React.useCallback(() => {
    if (!toolbarRef.current) return [];
    return Array.from(
      toolbarRef.current.querySelectorAll(
        'button:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]:not([disabled])',
      ),
    );
  }, [toolbarRef]);
  React.useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    const updateItems = () => setItems(collectItems());
    updateItems();
    const observer = new MutationObserver(updateItems);
    observer.observe(toolbar, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [collectItems, toolbarRef]);
  const { selectedIndex } = useMenuNavigation({
    containerRef: toolbarRef,
    items,
    orientation: "horizontal",
    onSelect: (el) => el.click(),
    autoSelectFirstItem: false,
  });
  React.useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    const handleFocus = (e) => {
      const target = e.target;
      if (toolbar.contains(target)) target.setAttribute("data-focus-visible", "true");
    };
    const handleBlur = (e) => {
      const target = e.target;
      if (toolbar.contains(target)) target.removeAttribute("data-focus-visible");
    };
    toolbar.addEventListener("focus", handleFocus, true);
    toolbar.addEventListener("blur", handleBlur, true);
    return () => {
      toolbar.removeEventListener("focus", handleFocus, true);
      toolbar.removeEventListener("blur", handleBlur, true);
    };
  }, [toolbarRef]);
  React.useEffect(() => {
    if (selectedIndex !== void 0 && items[selectedIndex]) {
      items[selectedIndex].focus();
    }
  }, [selectedIndex, items]);
}
function Toolbar({ ref, children, className, variant = "fixed", ...props }) {
  const toolbarRef = React.useRef(null);
  const composedRef = useComposedRef(toolbarRef, ref);
  useToolbarNavigation(toolbarRef);
  return /* @__PURE__ */ jsx("div", {
    ref: composedRef,
    role: "toolbar",
    "aria-label": "toolbar",
    "data-variant": variant,
    className: cn("tiptap-toolbar", className),
    ...props,
    children,
  });
}
Toolbar.displayName = "Toolbar";
function ToolbarGroup({ ref, children, className, ...props }) {
  return /* @__PURE__ */ jsx("div", {
    ref,
    role: "group",
    className: cn("tiptap-toolbar-group", className),
    ...props,
    children,
  });
}
ToolbarGroup.displayName = "ToolbarGroup";
function ToolbarSeparator({ ref, ...props }) {
  return /* @__PURE__ */ jsx(Separator, {
    ref,
    orientation: "vertical",
    decorative: true,
    ...props,
  });
}
ToolbarSeparator.displayName = "ToolbarSeparator";
function Badge({
  ref,
  variant,
  size = "default",
  appearance = "default",
  trimText = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx("div", {
    ref,
    className: `tiptap-badge ${className || ""}`,
    "data-style": variant,
    "data-size": size,
    "data-appearance": appearance,
    "data-text-trim": trimText ? "on" : "off",
    ...props,
    children,
  });
}
Badge.displayName = "Badge";
function useTiptapEditor(providedEditor) {
  const { editor: coreEditor } = useCurrentEditor();
  const mainEditor = React.useMemo(
    () => providedEditor || coreEditor,
    [providedEditor, coreEditor],
  );
  const editorState = useEditorState({
    editor: mainEditor,
    selector(context) {
      if (!context.editor) {
        return {
          editor: null,
          editorState: void 0,
          canCommand: void 0,
        };
      }
      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can,
      };
    },
  });
  return editorState || { editor: null };
}
function BlockquoteShortcutBadge({ shortcutKeys = BLOCKQUOTE_SHORTCUT_KEY }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function BlockquoteButton({
  ref,
  editor: providedEditor,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    canToggle: canToggle2,
    isActive,
    handleToggle,
    label,
    shortcutKeys,
    Icon,
  } = useBlockquote({
    editor,
    hideWhenUnavailable,
    onToggled,
  });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleToggle();
    },
    [handleToggle, onClick],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    role: "button",
    tabIndex: -1,
    disabled: !canToggle2,
    "data-disabled": !canToggle2,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: "Blockquote",
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut && /* @__PURE__ */ jsx(BlockquoteShortcutBadge, { shortcutKeys }),
        ],
      }),
  });
}
BlockquoteButton.displayName = "BlockquoteButton";
const BlockquoteIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8 6C8 5.44772 8.44772 5 9 5H16C16.5523 5 17 5.44772 17 6C17 6.55228 16.5523 7 16 7H9C8.44772 7 8 6.55228 8 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4 3C4.55228 3 5 3.44772 5 4L5 20C5 20.5523 4.55229 21 4 21C3.44772 21 3 20.5523 3 20L3 4C3 3.44772 3.44772 3 4 3Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8 12C8 11.4477 8.44772 11 9 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H9C8.44772 13 8 12.5523 8 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8 18C8 17.4477 8.44772 17 9 17H16C16.5523 17 17 17.4477 17 18C17 18.5523 16.5523 19 16 19H9C8.44772 19 8 18.5523 8 18Z",
        fill: "currentColor",
      }),
    ],
  });
});
BlockquoteIcon.displayName = "BlockquoteIcon";
const BLOCKQUOTE_SHORTCUT_KEY = "mod+shift+b";
function canToggleBlockquote(editor, turnInto = true) {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema("blockquote", editor) || isNodeTypeSelected(editor, ["image"])) {
    return false;
  }
  if (!turnInto) {
    return editor.can().toggleWrap("blockquote");
  }
  try {
    const view = editor.view;
    const state = view.state;
    const selection = state.selection;
    if (selection.empty || selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
function toggleBlockquote(editor) {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleBlockquote(editor)) return false;
  try {
    const view = editor.view;
    let state = view.state;
    let tr = state.tr;
    if (state.selection.empty || state.selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
      tr = tr.setSelection(NodeSelection.create(state.doc, pos));
      view.dispatch(tr);
      state = view.state;
    }
    const selection = state.selection;
    let chain = editor.chain().focus();
    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild;
      const lastChild = selection.node.lastChild?.lastChild;
      const from = firstChild ? selection.from + firstChild.nodeSize : selection.from + 1;
      const to = lastChild ? selection.to - lastChild.nodeSize : selection.to - 1;
      chain = chain.setTextSelection({ from, to }).clearNodes();
    }
    const toggle = editor.isActive("blockquote")
      ? chain.lift("blockquote")
      : chain.wrapIn("blockquote");
    toggle.run();
    editor.chain().focus().selectTextblockEnd().run();
    return true;
  } catch {
    return false;
  }
}
function shouldShowButton$8(props) {
  const { editor, hideWhenUnavailable } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema("blockquote", editor)) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleBlockquote(editor);
  }
  return true;
}
function useBlockquote(config) {
  const { editor: providedEditor, hideWhenUnavailable = false, onToggled } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const canToggle2 = canToggleBlockquote(editor);
  const isActive = editor?.isActive("blockquote") || false;
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$8({ editor, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);
  const handleToggle = React.useCallback(() => {
    if (!editor) return false;
    const success = toggleBlockquote(editor);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, onToggled]);
  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggle2,
    label: "Blockquote",
    shortcutKeys: BLOCKQUOTE_SHORTCUT_KEY,
    Icon: BlockquoteIcon,
  };
}
function BookmarkIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",
    }),
  });
}
function Popover({ ...props }) {
  return /* @__PURE__ */ jsx(Popover$1.Root, { ...props });
}
function PopoverTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(Popover$1.Trigger, { ...props });
}
function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(Popover$1.Portal, {
    children: /* @__PURE__ */ jsx(Popover$1.Positioner, {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsx(Popover$1.Popup, {
        "data-slot": "popover-content",
        className: cn$1(
          "bg-popover tiptap-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 flex flex-col gap-4 rounded-2xl p-4 text-sm shadow-2xl ring-1 duration-100 z-50 w-72 origin-(--transform-origin) outline-hidden",
          className,
        ),
        ...props,
      }),
    }),
  });
}
function Card({ ref, className, ...props }) {
  return /* @__PURE__ */ jsx("div", { ref, className: cn("tiptap-card", className), ...props });
}
Card.displayName = "Card";
function CardBody({ ref, className, ...props }) {
  return /* @__PURE__ */ jsx("div", {
    ref,
    className: cn("tiptap-card-body", className),
    ...props,
  });
}
CardBody.displayName = "CardBody";
function CardItemGroup({ ref, className, orientation = "vertical", ...props }) {
  return /* @__PURE__ */ jsx("div", {
    ref,
    "data-orientation": orientation,
    className: cn("tiptap-card-item-group", className),
    ...props,
  });
}
CardItemGroup.displayName = "CardItemGroup";
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx("input", { type, className: cn("tiptap-input", className), ...props });
}
function InputGroup({ className, children, ...props }) {
  return /* @__PURE__ */ jsx("div", {
    className: cn("tiptap-input-group", className),
    ...props,
    children,
  });
}
function BookmarkPopoverContent({ editor, onClose }) {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleInsert = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    try {
      const _ = new URL(url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await hono.api.bookmark["fetch-og-data"].$post({
        json: { url },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bookmark data");
      }
      const result = await response.json();
      if (result.code !== 200 || !result.data) {
        throw new Error(result.message || "Failed to fetch bookmark data");
      }
      console.warn("Bookmark data to insert:", result.data);
      editor.chain().focus().setBookmark(result.data).run();
      setUrl("");
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to insert bookmark");
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    } else if (e.key === "Escape") {
      onClose?.();
    }
  };
  return /* @__PURE__ */ jsx(Card, {
    className: "border-none shadow-none!",
    children: /* @__PURE__ */ jsxs(CardBody, {
      className: "w-full",
      children: [
        /* @__PURE__ */ jsxs(CardItemGroup, {
          orientation: "horizontal",
          className: "flex",
          children: [
            /* @__PURE__ */ jsx(InputGroup, {
              className: "flex-1",
              children: /* @__PURE__ */ jsx(Input, {
                type: "url",
                placeholder: "Paste a bookmark link...",
                value: url,
                onChange: (e) => setUrl(e.target.value),
                onKeyDown: handleKeyDown,
                autoFocus: true,
                autoComplete: "off",
                autoCorrect: "off",
                autoCapitalize: "off",
                disabled: loading,
              }),
            }),
            /* @__PURE__ */ jsx(ButtonGroup, {
              orientation: "horizontal",
              children: /* @__PURE__ */ jsx(Button, {
                type: "button",
                onClick: handleInsert,
                title: "Insert bookmark",
                disabled: loading || !url.trim(),
                "data-style": "ghost",
                children: /* @__PURE__ */ jsx(CornerDownLeftIcon$1, {
                  className: "tiptap-button-icon",
                }),
              }),
            }),
          ],
        }),
        error &&
          /* @__PURE__ */ jsx(CardItemGroup, {
            orientation: "horizontal",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-xs text-red-500 px-2",
              children: error,
            }),
          }),
      ],
    }),
  });
}
function BookmarkButton() {
  const { editor } = useTiptapEditor();
  const [open, setOpen] = React.useState(false);
  if (!editor) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Popover, {
    open,
    onOpenChange: setOpen,
    children: [
      /* @__PURE__ */ jsx(PopoverTrigger, {
        nativeButton: true,
        render: /* @__PURE__ */ jsx(Button, {
          "data-style": "ghost",
          "aria-label": "Insert bookmark",
          title: "Insert bookmark",
          children: /* @__PURE__ */ jsx(BookmarkIcon, { className: "tiptap-button-icon" }),
        }),
      }),
      /* @__PURE__ */ jsx(PopoverContent, {
        className: "p-0",
        children: /* @__PURE__ */ jsx(BookmarkPopoverContent, {
          editor,
          onClose: () => setOpen(false),
        }),
      }),
    ],
  });
}
function CodeBlockShortcutBadge({ shortcutKeys = CODE_BLOCK_SHORTCUT_KEY }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function CodeBlockButton({
  ref,
  editor: providedEditor,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    canToggle: canToggle2,
    isActive,
    handleToggle,
    label,
    shortcutKeys,
    Icon,
  } = useCodeBlock({
    editor,
    hideWhenUnavailable,
    onToggled,
  });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleToggle();
    },
    [handleToggle, onClick],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    role: "button",
    disabled: !canToggle2,
    "data-disabled": !canToggle2,
    tabIndex: -1,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: "Code Block",
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut && /* @__PURE__ */ jsx(CodeBlockShortcutBadge, { shortcutKeys }),
        ],
      }),
  });
}
CodeBlockButton.displayName = "CodeBlockButton";
const CodeBlockIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6.70711 2.29289C7.09763 2.68342 7.09763 3.31658 6.70711 3.70711L4.41421 6L6.70711 8.29289C7.09763 8.68342 7.09763 9.31658 6.70711 9.70711C6.31658 10.0976 5.68342 10.0976 5.29289 9.70711L2.29289 6.70711C1.90237 6.31658 1.90237 5.68342 2.29289 5.29289L5.29289 2.29289C5.68342 1.90237 6.31658 1.90237 6.70711 2.29289Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M10.2929 2.29289C10.6834 1.90237 11.3166 1.90237 11.7071 2.29289L14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L11.7071 9.70711C11.3166 10.0976 10.6834 10.0976 10.2929 9.70711C9.90237 9.31658 9.90237 8.68342 10.2929 8.29289L12.5858 6L10.2929 3.70711C9.90237 3.31658 9.90237 2.68342 10.2929 2.29289Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M17 4C17 3.44772 17.4477 3 18 3H19C20.6569 3 22 4.34315 22 6V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V12C2 11.4477 2.44772 11 3 11C3.55228 11 4 11.4477 4 12V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V6C20 5.44772 19.5523 5 19 5H18C17.4477 5 17 4.55228 17 4Z",
        fill: "currentColor",
      }),
    ],
  });
});
CodeBlockIcon.displayName = "CodeBlockIcon";
const CODE_BLOCK_SHORTCUT_KEY = "mod+alt+c";
function canToggle$1(editor, turnInto = true) {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema("codeBlock", editor) || isNodeTypeSelected(editor, ["image"])) {
    return false;
  }
  if (!turnInto) {
    return editor.can().toggleNode("codeBlock", "paragraph");
  }
  try {
    const view = editor.view;
    const state = view.state;
    const selection = state.selection;
    if (selection.empty || selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
function toggleCodeBlock(editor) {
  if (!editor || !editor.isEditable) return false;
  if (!canToggle$1(editor)) return false;
  try {
    const view = editor.view;
    let state = view.state;
    let tr = state.tr;
    if (state.selection.empty || state.selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
      tr = tr.setSelection(NodeSelection.create(state.doc, pos));
      view.dispatch(tr);
      state = view.state;
    }
    const selection = state.selection;
    let chain = editor.chain().focus();
    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild;
      const lastChild = selection.node.lastChild?.lastChild;
      const from = firstChild ? selection.from + firstChild.nodeSize : selection.from + 1;
      const to = lastChild ? selection.to - lastChild.nodeSize : selection.to - 1;
      chain = chain.setTextSelection({ from, to }).clearNodes();
    }
    const toggle = editor.isActive("codeBlock")
      ? chain.setNode("paragraph")
      : chain.toggleNode("codeBlock", "paragraph");
    toggle.run();
    editor.chain().focus().selectTextblockEnd().run();
    return true;
  } catch {
    return false;
  }
}
function shouldShowButton$7(props) {
  const { editor, hideWhenUnavailable } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema("codeBlock", editor)) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggle$1(editor);
  }
  return true;
}
function useCodeBlock(config) {
  const { editor: providedEditor, hideWhenUnavailable = false, onToggled } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const canToggleState = canToggle$1(editor);
  const isActive = editor?.isActive("codeBlock") || false;
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$7({ editor, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);
  const handleToggle = React.useCallback(() => {
    if (!editor) return false;
    const success = toggleCodeBlock(editor);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, onToggled]);
  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggleState,
    label: "Code Block",
    shortcutKeys: CODE_BLOCK_SHORTCUT_KEY,
    Icon: CodeBlockIcon,
  };
}
const BanIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.43471 4.01458C4.34773 4.06032 4.26607 4.11977 4.19292 4.19292C4.11977 4.26607 4.06032 4.34773 4.01458 4.43471C2.14611 6.40628 1 9.0693 1 12C1 18.0751 5.92487 23 12 23C14.9306 23 17.5936 21.854 19.5651 19.9856C19.6522 19.9398 19.7339 19.8803 19.8071 19.8071C19.8803 19.7339 19.9398 19.6522 19.9856 19.5651C21.854 17.5936 23 14.9306 23 12C23 5.92487 18.0751 1 12 1C9.0693 1 6.40628 2.14611 4.43471 4.01458ZM6.38231 4.9681C7.92199 3.73647 9.87499 3 12 3C16.9706 3 21 7.02944 21 12C21 14.125 20.2635 16.078 19.0319 17.6177L6.38231 4.9681ZM17.6177 19.0319C16.078 20.2635 14.125 21 12 21C7.02944 21 3 16.9706 3 12C3 9.87499 3.73647 7.92199 4.9681 6.38231L17.6177 19.0319Z",
      fill: "currentColor",
    }),
  });
});
BanIcon.displayName = "BanIcon";
function ColorHighlightShortcutBadge({ shortcutKeys = COLOR_HIGHLIGHT_SHORTCUT_KEY }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function ColorHighlightButton({
  ref,
  editor: providedEditor,
  highlightColor,
  text,
  hideWhenUnavailable = false,
  onApplied,
  showShortcut = false,
  onClick,
  children,
  style,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    canColorHighlight: canColorHighlight2,
    isActive,
    handleColorHighlight,
    label,
    shortcutKeys,
  } = useColorHighlight({
    editor,
    highlightColor,
    label: text || `Toggle highlight (${highlightColor})`,
    hideWhenUnavailable,
    onApplied,
  });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleColorHighlight();
    },
    [handleColorHighlight, onClick],
  );
  const buttonStyle = React.useMemo(
    () => ({
      ...style,
      "--highlight-color": highlightColor,
    }),
    [highlightColor, style],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    role: "button",
    tabIndex: -1,
    disabled: !canColorHighlight2,
    "data-disabled": !canColorHighlight2,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: label,
    onClick: handleClick,
    style: buttonStyle,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx("span", {
            className: "tiptap-button-highlight",
            style: { "--highlight-color": highlightColor },
          }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut && /* @__PURE__ */ jsx(ColorHighlightShortcutBadge, { shortcutKeys }),
        ],
      }),
  });
}
ColorHighlightButton.displayName = "ColorHighlightButton";
const COLOR_HIGHLIGHT_SHORTCUT_KEY = "mod+shift+h";
const HIGHLIGHT_COLORS = [
  {
    label: "Default background",
    value: "var(--tt-bg-color)",
    border: "var(--tt-bg-color-contrast)",
  },
  {
    label: "Gray background",
    value: "var(--tt-color-highlight-gray)",
    border: "var(--tt-color-highlight-gray-contrast)",
  },
  {
    label: "Brown background",
    value: "var(--tt-color-highlight-brown)",
    border: "var(--tt-color-highlight-brown-contrast)",
  },
  {
    label: "Orange background",
    value: "var(--tt-color-highlight-orange)",
    border: "var(--tt-color-highlight-orange-contrast)",
  },
  {
    label: "Yellow background",
    value: "var(--tt-color-highlight-yellow)",
    border: "var(--tt-color-highlight-yellow-contrast)",
  },
  {
    label: "Green background",
    value: "var(--tt-color-highlight-green)",
    border: "var(--tt-color-highlight-green-contrast)",
  },
  {
    label: "Blue background",
    value: "var(--tt-color-highlight-blue)",
    border: "var(--tt-color-highlight-blue-contrast)",
  },
  {
    label: "Purple background",
    value: "var(--tt-color-highlight-purple)",
    border: "var(--tt-color-highlight-purple-contrast)",
  },
  {
    label: "Pink background",
    value: "var(--tt-color-highlight-pink)",
    border: "var(--tt-color-highlight-pink-contrast)",
  },
  {
    label: "Red background",
    value: "var(--tt-color-highlight-red)",
    border: "var(--tt-color-highlight-red-contrast)",
  },
];
function pickHighlightColorsByValue(values) {
  const colorMap = new Map(HIGHLIGHT_COLORS.map((color) => [color.value, color]));
  return values.map((value) => colorMap.get(value)).filter((color) => !!color);
}
function canColorHighlight(editor) {
  if (!editor || !editor.isEditable) return false;
  if (!isMarkInSchema("highlight", editor) || isNodeTypeSelected(editor, ["image"])) {
    return false;
  }
  return editor.can().setMark("highlight");
}
function isColorHighlightActive(editor, highlightColor) {
  if (!editor || !editor.isEditable) return false;
  return highlightColor
    ? editor.isActive("highlight", { color: highlightColor })
    : editor.isActive("highlight");
}
function removeHighlight(editor) {
  if (!editor || !editor.isEditable) return false;
  if (!canColorHighlight(editor)) return false;
  return editor.chain().focus().unsetMark("highlight").run();
}
function shouldShowButton$6(props) {
  const { editor, hideWhenUnavailable } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isMarkInSchema("highlight", editor)) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canColorHighlight(editor);
  }
  return true;
}
function useColorHighlight(config) {
  const {
    editor: providedEditor,
    label,
    highlightColor,
    hideWhenUnavailable = false,
    onApplied,
  } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = React.useState(true);
  const canColorHighlightState = canColorHighlight(editor);
  const isActive = isColorHighlightActive(editor, highlightColor);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$6({ editor, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);
  const handleColorHighlight = React.useCallback(() => {
    if (!editor || !canColorHighlightState || !highlightColor || !label) return false;
    if (editor.state.storedMarks) {
      const highlightMarkType = editor.schema.marks.highlight;
      if (highlightMarkType) {
        editor.view.dispatch(editor.state.tr.removeStoredMark(highlightMarkType));
      }
    }
    setTimeout(() => {
      const success = editor
        .chain()
        .focus()
        .toggleMark("highlight", { color: highlightColor })
        .run();
      if (success) {
        onApplied?.({ color: highlightColor, label });
      }
      return success;
    }, 0);
  }, [canColorHighlightState, highlightColor, editor, label, onApplied]);
  const handleRemoveHighlight = React.useCallback(() => {
    const success = removeHighlight(editor);
    if (success) {
      onApplied?.({ color: "", label: "Remove highlight" });
    }
    return success;
  }, [editor, onApplied]);
  useHotkeys(
    COLOR_HIGHLIGHT_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleColorHighlight();
    },
    {
      enabled: isVisible && canColorHighlightState,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    },
  );
  return {
    isVisible,
    isActive,
    handleColorHighlight,
    handleRemoveHighlight,
    canColorHighlight: canColorHighlightState,
    label: label || "Highlight",
    shortcutKeys: COLOR_HIGHLIGHT_SHORTCUT_KEY,
    Icon: HighlighterIcon,
  };
}
function ColorHighlightPopoverButton({ ref, className, children, ...props }) {
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    className,
    "data-style": "ghost",
    "data-appearance": "default",
    role: "button",
    tabIndex: -1,
    "aria-label": "Highlight text",
    tooltip: "Highlight",
    ref,
    ...props,
    children: children ?? /* @__PURE__ */ jsx(HighlighterIcon, { className: "tiptap-button-icon" }),
  });
}
ColorHighlightPopoverButton.displayName = "ColorHighlightPopoverButton";
function ColorHighlightPopoverContent({
  editor,
  // eslint-disable-next-line react/no-unstable-default-props
  colors = pickHighlightColorsByValue([
    "var(--tt-color-highlight-green)",
    "var(--tt-color-highlight-blue)",
    "var(--tt-color-highlight-red)",
    "var(--tt-color-highlight-purple)",
    "var(--tt-color-highlight-yellow)",
  ]),
}) {
  const { handleRemoveHighlight } = useColorHighlight({ editor });
  const isMobile = useIsMobile();
  const containerRef = React.useRef(null);
  const menuItems = React.useMemo(
    () => [...colors, { label: "Remove highlight", value: "none" }],
    [colors],
  );
  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: "both",
    onSelect: (item) => {
      if (!containerRef.current) return false;
      const highlightedElement = containerRef.current.querySelector('[data-highlighted="true"]');
      if (highlightedElement) highlightedElement.click();
      if (item.value === "none") handleRemoveHighlight();
    },
    autoSelectFirstItem: false,
  });
  return /* @__PURE__ */ jsx(Card, {
    ref: containerRef,
    tabIndex: 0,
    style: isMobile ? { boxShadow: "none", border: 0 } : {},
    children: /* @__PURE__ */ jsx(CardBody, {
      style: isMobile ? { padding: 0 } : {},
      children: /* @__PURE__ */ jsxs(CardItemGroup, {
        orientation: "horizontal",
        children: [
          /* @__PURE__ */ jsx(ButtonGroup, {
            orientation: "horizontal",
            children: colors.map((color, index) =>
              /* @__PURE__ */ jsx(
                ColorHighlightButton,
                {
                  editor,
                  highlightColor: color.value,
                  tooltip: color.label,
                  "aria-label": `${color.label} highlight color`,
                  tabIndex: index === selectedIndex ? 0 : -1,
                  "data-highlighted": selectedIndex === index,
                },
                color.value,
              ),
            ),
          }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsx(ButtonGroup, {
            orientation: "horizontal",
            children: /* @__PURE__ */ jsx(Button, {
              onClick: handleRemoveHighlight,
              "aria-label": "Remove highlight",
              tooltip: "Remove highlight",
              tabIndex: selectedIndex === colors.length ? 0 : -1,
              type: "button",
              role: "menuitem",
              "data-style": "ghost",
              "data-highlighted": selectedIndex === colors.length,
              children: /* @__PURE__ */ jsx(BanIcon, { className: "tiptap-button-icon" }),
            }),
          }),
        ],
      }),
    }),
  });
}
function ColorHighlightPopover({
  editor: providedEditor,
  // eslint-disable-next-line react/no-unstable-default-props
  colors = pickHighlightColorsByValue([
    "var(--tt-color-highlight-green)",
    "var(--tt-color-highlight-blue)",
    "var(--tt-color-highlight-red)",
    "var(--tt-color-highlight-purple)",
    "var(--tt-color-highlight-yellow)",
  ]),
  hideWhenUnavailable = false,
  onApplied,
  ...props
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    isVisible,
    canColorHighlight: canColorHighlight2,
    isActive,
    label,
    Icon,
  } = useColorHighlight({
    editor,
    hideWhenUnavailable,
    onApplied,
  });
  if (!isVisible) return null;
  return /* @__PURE__ */ jsxs(Popover, {
    open: isOpen,
    onOpenChange: setIsOpen,
    children: [
      /* @__PURE__ */ jsx(PopoverTrigger, {
        nativeButton: true,
        render: /* @__PURE__ */ jsx(ColorHighlightPopoverButton, {
          disabled: !canColorHighlight2,
          "data-active-state": isActive ? "on" : "off",
          "data-disabled": !canColorHighlight2,
          "aria-pressed": isActive,
          "aria-label": label,
          tooltip: label,
          ...props,
          children: /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
        }),
      }),
      /* @__PURE__ */ jsx(PopoverContent, {
        "aria-label": "Highlight colors",
        className: "p-0",
        children: /* @__PURE__ */ jsx(ColorHighlightPopoverContent, { editor, colors }),
      }),
    ],
  });
}
const ChevronDownIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z",
      fill: "currentColor",
    }),
  });
});
ChevronDownIcon.displayName = "ChevronDownIcon";
function DropdownMenu({ modal = false, ...props }) {
  return /* @__PURE__ */ jsx(Menu.Root, { modal, ...props });
}
function DropdownMenuPortal({ ...props }) {
  return /* @__PURE__ */ jsx(Menu.Portal, { ...props });
}
function DropdownMenuTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(Menu.Trigger, { ...props });
}
function DropdownMenuItem({ ...props }) {
  return /* @__PURE__ */ jsx(Menu.Item, { ...props });
}
function DropdownMenuContent({
  ref,
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  portal = false,
  ...props
}) {
  const content = /* @__PURE__ */ jsx(Menu.Positioner, {
    className: "isolate z-50 outline-none",
    align,
    alignOffset,
    side,
    sideOffset,
    children: /* @__PURE__ */ jsx(Menu.Popup, {
      ref,
      className: (state) => {
        const baseClass = "tiptap-dropdown-menu";
        if (typeof className === "function") {
          const customClass = className(state);
          return customClass ? `${baseClass} ${customClass}` : baseClass;
        }
        return className ? `${baseClass} ${className}` : baseClass;
      },
      ...props,
    }),
  });
  return portal ? /* @__PURE__ */ jsx(Menu.Portal, { children: content }) : content;
}
function HeadingShortcutBadge({ level, shortcutKeys = HEADING_SHORTCUT_KEYS[level] }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function HeadingButton({
  ref,
  editor: providedEditor,
  level,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    canToggle: canToggle2,
    isActive,
    handleToggle,
    label,
    Icon,
    shortcutKeys,
  } = useHeading({
    editor,
    level,
    hideWhenUnavailable,
    onToggled,
  });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleToggle();
    },
    [handleToggle, onClick],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    role: "button",
    tabIndex: -1,
    disabled: !canToggle2,
    "data-disabled": !canToggle2,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: label,
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut && /* @__PURE__ */ jsx(HeadingShortcutBadge, { level, shortcutKeys }),
        ],
      }),
  });
}
HeadingButton.displayName = "HeadingButton";
const HeadingFiveIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M16 10C16 9.44772 16.4477 9 17 9H21C21.5523 9 22 9.44772 22 10C22 10.5523 21.5523 11 21 11H18V12H18.3C20.2754 12 22 13.4739 22 15.5C22 17.5261 20.2754 19 18.3 19C17.6457 19 17.0925 18.8643 16.5528 18.5944C16.0588 18.3474 15.8586 17.7468 16.1055 17.2528C16.3525 16.7588 16.9532 16.5586 17.4472 16.8056C17.7074 16.9357 17.9542 17 18.3 17C19.3246 17 20 16.2739 20 15.5C20 14.7261 19.3246 14 18.3 14H17C16.4477 14 16 13.5523 16 13L16 12.9928V10Z",
        fill: "currentColor",
      }),
    ],
  });
});
HeadingFiveIcon.displayName = "HeadingFiveIcon";
const HeadingFourIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M4 5C4.55228 5 5 5.44772 5 6V11H11V6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H5V18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18V6C3 5.44772 3.44772 5 4 5Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M17 9C17.5523 9 18 9.44772 18 10V13H20V10C20 9.44772 20.4477 9 21 9C21.5523 9 22 9.44772 22 10V18C22 18.5523 21.5523 19 21 19C20.4477 19 20 18.5523 20 18V15H17C16.4477 15 16 14.5523 16 14V10C16 9.44772 16.4477 9 17 9Z",
        fill: "currentColor",
      }),
    ],
  });
});
HeadingFourIcon.displayName = "HeadingFourIcon";
const HeadingOneIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M21.0001 10C21.0001 9.63121 20.7971 9.29235 20.472 9.11833C20.1468 8.94431 19.7523 8.96338 19.4454 9.16795L16.4454 11.168C15.9859 11.4743 15.8617 12.0952 16.1681 12.5547C16.4744 13.0142 17.0953 13.1384 17.5548 12.8321L19.0001 11.8685V18C19.0001 18.5523 19.4478 19 20.0001 19C20.5524 19 21.0001 18.5523 21.0001 18V10Z",
        fill: "currentColor",
      }),
    ],
  });
});
HeadingOneIcon.displayName = "HeadingOneIcon";
const HeadingSixIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M20.7071 9.29289C21.0976 9.68342 21.0976 10.3166 20.7071 10.7071C19.8392 11.575 19.2179 12.2949 18.7889 13.0073C18.8587 13.0025 18.929 13 19 13C20.6569 13 22 14.3431 22 16C22 17.6569 20.6569 19 19 19C17.3431 19 16 17.6569 16 16C16 14.6007 16.2837 13.4368 16.8676 12.3419C17.4384 11.2717 18.2728 10.3129 19.2929 9.29289C19.6834 8.90237 20.3166 8.90237 20.7071 9.29289ZM19 17C18.4477 17 18 16.5523 18 16C18 15.4477 18.4477 15 19 15C19.5523 15 20 15.4477 20 16C20 16.5523 19.5523 17 19 17Z",
        fill: "currentColor",
      }),
    ],
  });
});
HeadingSixIcon.displayName = "HeadingSixIcon";
const HeadingThreeIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M4 5C4.55228 5 5 5.44772 5 6V11H11V6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H5V18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18V6C3 5.44772 3.44772 5 4 5Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M19.4608 11.2169C19.1135 11.0531 18.5876 11.0204 18.0069 11.3619C17.5309 11.642 16.918 11.4831 16.638 11.007C16.358 10.531 16.5169 9.91809 16.9929 9.63807C18.1123 8.97962 19.3364 8.94691 20.314 9.40808C21.2839 9.86558 21.9999 10.818 21.9999 12C21.9999 12.7957 21.6838 13.5587 21.1212 14.1213C20.5586 14.6839 19.7956 15 18.9999 15C18.4476 15 17.9999 14.5523 17.9999 14C17.9999 13.4477 18.4476 13 18.9999 13C19.2651 13 19.5195 12.8947 19.707 12.7071C19.8946 12.5196 19.9999 12.2652 19.9999 12C19.9999 11.6821 19.8159 11.3844 19.4608 11.2169Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M18.0001 14C18.0001 13.4477 18.4478 13 19.0001 13C19.7957 13 20.5588 13.3161 21.1214 13.8787C21.684 14.4413 22.0001 15.2043 22.0001 16C22.0001 17.2853 21.2767 18.3971 20.1604 18.8994C19.0257 19.41 17.642 19.2315 16.4001 18.3C15.9582 17.9686 15.8687 17.3418 16.2001 16.9C16.5314 16.4582 17.1582 16.3686 17.6001 16.7C18.3581 17.2685 18.9744 17.24 19.3397 17.0756C19.7234 16.9029 20.0001 16.5147 20.0001 16C20.0001 15.7348 19.8947 15.4804 19.7072 15.2929C19.5196 15.1054 19.2653 15 19.0001 15C18.4478 15 18.0001 14.5523 18.0001 14Z",
        fill: "currentColor",
      }),
    ],
  });
});
HeadingThreeIcon.displayName = "HeadingThreeIcon";
const HeadingTwoIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M22.0001 12C22.0001 10.7611 21.1663 9.79297 20.0663 9.42632C18.9547 9.05578 17.6171 9.28724 16.4001 10.2C15.9582 10.5314 15.8687 11.1582 16.2001 11.6C16.5314 12.0418 17.1582 12.1314 17.6001 11.8C18.383 11.2128 19.0455 11.1942 19.4338 11.3237C19.8339 11.457 20.0001 11.7389 20.0001 12C20.0001 12.4839 19.8554 12.7379 19.6537 12.9481C19.4275 13.1837 19.1378 13.363 18.7055 13.6307C18.6313 13.6767 18.553 13.7252 18.4701 13.777C17.9572 14.0975 17.3128 14.5261 16.8163 15.2087C16.3007 15.9177 16.0001 16.8183 16.0001 18C16.0001 18.5523 16.4478 19 17.0001 19H21.0001C21.5523 19 22.0001 18.5523 22.0001 18C22.0001 17.4477 21.5523 17 21.0001 17H18.131C18.21 16.742 18.3176 16.5448 18.4338 16.385C18.6873 16.0364 19.0429 15.7775 19.5301 15.473C19.5898 15.4357 19.6536 15.3966 19.7205 15.3556C20.139 15.0992 20.6783 14.7687 21.0964 14.3332C21.6447 13.7621 22.0001 13.0161 22.0001 12Z",
        fill: "currentColor",
      }),
    ],
  });
});
HeadingTwoIcon.displayName = "HeadingTwoIcon";
const headingIcons = {
  1: HeadingOneIcon,
  2: HeadingTwoIcon,
  3: HeadingThreeIcon,
  4: HeadingFourIcon,
  5: HeadingFiveIcon,
  6: HeadingSixIcon,
};
const HEADING_SHORTCUT_KEYS = {
  1: "ctrl+alt+1",
  2: "ctrl+alt+2",
  3: "ctrl+alt+3",
  4: "ctrl+alt+4",
  5: "ctrl+alt+5",
  6: "ctrl+alt+6",
};
function canToggle(editor, level, turnInto = true) {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema("heading", editor) || isNodeTypeSelected(editor, ["image"])) {
    return false;
  }
  if (!turnInto) {
    return level ? editor.can().setNode("heading", { level }) : editor.can().setNode("heading");
  }
  try {
    const view = editor.view;
    const state = view.state;
    const selection = state.selection;
    if (selection.empty || selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
function isHeadingActive(editor, level) {
  if (!editor || !editor.isEditable) return false;
  if (Array.isArray(level)) {
    return level.some((l) => editor.isActive("heading", { level: l }));
  }
  return level ? editor.isActive("heading", { level }) : editor.isActive("heading");
}
function toggleHeading(editor, level) {
  if (!editor || !editor.isEditable) return false;
  const levels = Array.isArray(level) ? level : [level];
  const toggleLevel = levels.find((l) => canToggle(editor, l));
  if (!toggleLevel) return false;
  try {
    const view = editor.view;
    let state = view.state;
    let tr = state.tr;
    if (state.selection.empty || state.selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
      tr = tr.setSelection(NodeSelection.create(state.doc, pos));
      view.dispatch(tr);
      state = view.state;
    }
    const selection = state.selection;
    let chain = editor.chain().focus();
    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild;
      const lastChild = selection.node.lastChild?.lastChild;
      const from = firstChild ? selection.from + firstChild.nodeSize : selection.from + 1;
      const to = lastChild ? selection.to - lastChild.nodeSize : selection.to - 1;
      chain = chain.setTextSelection({ from, to }).clearNodes();
    }
    const isActive = levels.some((l) => editor.isActive("heading", { level: l }));
    const toggle = isActive
      ? chain.setNode("paragraph")
      : chain.setNode("heading", { level: toggleLevel });
    toggle.run();
    editor.chain().focus().selectTextblockEnd().run();
    return true;
  } catch {
    return false;
  }
}
function shouldShowButton$5(props) {
  const { editor, level, hideWhenUnavailable } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema("heading", editor)) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    if (Array.isArray(level)) {
      return level.some((l) => canToggle(editor, l));
    }
    return canToggle(editor, level);
  }
  return true;
}
function useHeading(config) {
  const { editor: providedEditor, level, hideWhenUnavailable = false, onToggled } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const canToggleState = canToggle(editor, level);
  const isActive = isHeadingActive(editor, level);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$5({ editor, level, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, level, hideWhenUnavailable]);
  const handleToggle = React.useCallback(() => {
    if (!editor) return false;
    const success = toggleHeading(editor, level);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, level, onToggled]);
  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggleState,
    label: `Heading ${level}`,
    shortcutKeys: HEADING_SHORTCUT_KEYS[level],
    Icon: headingIcons[level],
  };
}
const defaultLevels = [1, 2, 3, 4, 5, 6];
function HeadingDropdownMenu({
  ref,
  editor: providedEditor,
  levels = defaultLevels,
  hideWhenUnavailable = false,
  portal = false,
  onOpenChange,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    isVisible,
    isActive,
    canToggle: canToggle2,
    Icon,
  } = useHeadingDropdownMenu({
    editor,
    levels,
    hideWhenUnavailable,
  });
  const handleOpenChange = React.useCallback(
    (open) => {
      if (!editor || !canToggle2) return;
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [canToggle2, editor, onOpenChange],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsxs(DropdownMenu, {
    modal: true,
    open: isOpen,
    onOpenChange: handleOpenChange,
    children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, {
        nativeButton: true,
        render: /* @__PURE__ */ jsxs(Button, {
          className: "tiptap-button",
          type: "button",
          "data-style": "ghost",
          "data-active-state": isActive ? "on" : "off",
          role: "button",
          tabIndex: -1,
          disabled: !canToggle2,
          "data-disabled": !canToggle2,
          "aria-label": "Format text as heading",
          "aria-pressed": isActive,
          tooltip: "Heading",
          ...buttonProps,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
            /* @__PURE__ */ jsx(ChevronDownIcon, { className: "tiptap-button-dropdown-small" }),
          ],
        }),
      }),
      /* @__PURE__ */ jsx(DropdownMenuPortal, {
        children: /* @__PURE__ */ jsx(DropdownMenuContent, {
          align: "start",
          portal,
          children: /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsx(CardBody, {
              children: /* @__PURE__ */ jsx(ButtonGroup, {
                children: levels.map((level) =>
                  /* @__PURE__ */ jsx(
                    DropdownMenuItem,
                    {
                      nativeButton: true,
                      render: /* @__PURE__ */ jsx(HeadingButton, {
                        editor,
                        level,
                        text: `Heading ${level}`,
                        showTooltip: false,
                      }),
                    },
                    `heading-${level}`,
                  ),
                ),
              }),
            }),
          }),
        }),
      }),
    ],
  });
}
HeadingDropdownMenu.displayName = "HeadingDropdownMenu";
const HeadingIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      d: "M6 3C6.55228 3 7 3.44772 7 4V11H17V4C17 3.44772 17.4477 3 18 3C18.5523 3 19 3.44772 19 4V20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20V13H7V20C7 20.5523 6.55228 21 6 21C5.44772 21 5 20.5523 5 20V4C5 3.44772 5.44772 3 6 3Z",
      fill: "currentColor",
    }),
  });
});
HeadingIcon.displayName = "HeadingIcon";
function getActiveHeadingLevel(editor, levels = [1, 2, 3, 4, 5, 6]) {
  if (!editor || !editor.isEditable) return void 0;
  return levels.find((level) => isHeadingActive(editor, level));
}
function useHeadingDropdownMenu(config) {
  const {
    editor: providedEditor,
    levels = [1, 2, 3, 4, 5, 6],
    hideWhenUnavailable = false,
  } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const activeLevel = getActiveHeadingLevel(editor, levels);
  const isActive = isHeadingActive(editor);
  const canToggleState = canToggle(editor);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$5({ editor, hideWhenUnavailable, level: levels }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, levels]);
  return {
    isVisible,
    activeLevel,
    isActive,
    canToggle: canToggleState,
    levels,
    label: "Heading",
    Icon: activeLevel ? headingIcons[activeLevel] : HeadingIcon,
  };
}
function IFrameIcon({ className }) {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    children: [
      /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M8 21h8" }),
      /* @__PURE__ */ jsx("path", { d: "M12 17v4" }),
      /* @__PURE__ */ jsx("path", { d: "m7 8 3 3-3 3" }),
    ],
  });
}
function IFramePopoverContent({ editor, onClose }) {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const handleInsert = () => {
    if (!code.trim()) {
      setError("Please enter iframe code");
      return;
    }
    setError("");
    editor.chain().focus().setIFrame({ code: code.trim() }).run();
    setCode("");
    onClose?.();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleInsert();
    } else if (e.key === "Escape") {
      onClose?.();
    }
  };
  return /* @__PURE__ */ jsx(Card, {
    className: "border-none shadow-none!",
    children: /* @__PURE__ */ jsxs(CardBody, {
      className: "w-full",
      children: [
        /* @__PURE__ */ jsxs(CardItemGroup, {
          orientation: "horizontal",
          className: "flex",
          children: [
            /* @__PURE__ */ jsx(InputGroup, {
              className: "flex-1",
              children: /* @__PURE__ */ jsx(Input, {
                type: "url",
                placeholder: "Paste a iframe link...",
                value: code,
                onChange: (e) => setCode(e.target.value),
                onKeyDown: handleKeyDown,
                autoFocus: true,
                autoComplete: "off",
                autoCorrect: "off",
                autoCapitalize: "off",
              }),
            }),
            /* @__PURE__ */ jsx(ButtonGroup, {
              orientation: "horizontal",
              children: /* @__PURE__ */ jsx(Button, {
                type: "button",
                onClick: handleInsert,
                title: "Insert iframe",
                disabled: !code.trim(),
                "data-style": "ghost",
                children: /* @__PURE__ */ jsx(CornerDownLeftIcon$1, {
                  className: "tiptap-button-icon",
                }),
              }),
            }),
          ],
        }),
        error &&
          /* @__PURE__ */ jsx(CardItemGroup, {
            orientation: "horizontal",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-xs text-red-500 px-2",
              children: error,
            }),
          }),
      ],
    }),
  });
}
function IFrameButton() {
  const { editor } = useTiptapEditor();
  const [open, setOpen] = React.useState(false);
  if (!editor) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Popover, {
    open,
    onOpenChange: setOpen,
    children: [
      /* @__PURE__ */ jsx(PopoverTrigger, {
        nativeButton: true,
        render: /* @__PURE__ */ jsx(Button, {
          "data-style": "ghost",
          "aria-label": "Insert iframe",
          title: "Insert iframe",
          children: /* @__PURE__ */ jsx(IFrameIcon, { className: "tiptap-button-icon" }),
        }),
      }),
      /* @__PURE__ */ jsx(PopoverContent, {
        className: "p-0",
        children: /* @__PURE__ */ jsx(IFramePopoverContent, {
          editor,
          onClose: () => setOpen(false),
        }),
      }),
    ],
  });
}
function ImageShortcutBadge({ shortcutKeys = IMAGE_UPLOAD_SHORTCUT_KEY }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function ImageUploadButton({
  ref,
  editor: providedEditor,
  text,
  hideWhenUnavailable = false,
  onInserted,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, canInsert, handleImage, label, isActive, shortcutKeys, Icon } = useImageUpload(
    {
      editor,
      hideWhenUnavailable,
      onInserted,
    },
  );
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleImage();
    },
    [handleImage, onClick],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    role: "button",
    tabIndex: -1,
    disabled: !canInsert,
    "data-disabled": !canInsert,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: label,
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut && /* @__PURE__ */ jsx(ImageShortcutBadge, { shortcutKeys }),
        ],
      }),
  });
}
ImageUploadButton.displayName = "ImageUploadButton";
const ImagePlusIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M20 2C20 1.44772 19.5523 1 19 1C18.4477 1 18 1.44772 18 2V4H16C15.4477 4 15 4.44772 15 5C15 5.55228 15.4477 6 16 6H18V8C18 8.55228 18.4477 9 19 9C19.5523 9 20 8.55228 20 8V6H22C22.5523 6 23 5.55228 23 5C23 4.44772 22.5523 4 22 4H20V2ZM5 4C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H5.58579L14.379 11.2068C14.9416 10.6444 15.7045 10.3284 16.5 10.3284C17.2955 10.3284 18.0584 10.6444 18.621 11.2068L20 12.5858V12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12V14.998C22 14.9994 22 15.0007 22 15.002V19C22 19.7957 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7957 22 19 22H6.00219C6.00073 22 5.99927 22 5.99781 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7957 2 19V5C2 4.20435 2.31607 3.44129 2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H12C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4H5ZM8.41422 20H19C19.2652 20 19.5196 19.8946 19.7071 19.7071C19.8946 19.5196 20 19.2652 20 19V15.4142L17.207 12.6212C17.0195 12.4338 16.7651 12.3284 16.5 12.3284C16.2349 12.3284 15.9806 12.4337 15.7931 12.6211L8.41422 20ZM6.87868 6.87868C7.44129 6.31607 8.20435 6 9 6C9.79565 6 10.5587 6.31607 11.1213 6.87868C11.6839 7.44129 12 8.20435 12 9C12 9.79565 11.6839 10.5587 11.1213 11.1213C10.5587 11.6839 9.79565 12 9 12C8.20435 12 7.44129 11.6839 6.87868 11.1213C6.31607 10.5587 6 9.79565 6 9C6 8.20435 6.31607 7.44129 6.87868 6.87868ZM9 8C8.73478 8 8.48043 8.10536 8.29289 8.29289C8.10536 8.48043 8 8.73478 8 9C8 9.26522 8.10536 9.51957 8.29289 9.70711C8.48043 9.89464 8.73478 10 9 10C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9C10 8.73478 9.89464 8.48043 9.70711 8.29289C9.51957 8.10536 9.26522 8 9 8Z",
      fill: "currentColor",
    }),
  });
});
ImagePlusIcon.displayName = "ImagePlusIcon";
const IMAGE_UPLOAD_SHORTCUT_KEY = "mod+shift+i";
function canInsertImage(editor) {
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "imageUpload") || isNodeTypeSelected(editor, ["image"])) {
    return false;
  }
  return editor.can().insertContent({ type: "imageUpload" });
}
function isImageActive(editor) {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("imageUpload");
}
function insertImage(editor) {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertImage(editor)) return false;
  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: "imageUpload",
      })
      .run();
  } catch {
    return false;
  }
}
function shouldShowButton$4(props) {
  const { editor, hideWhenUnavailable } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "imageUpload")) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canInsertImage(editor);
  }
  return true;
}
function useImageUpload(config) {
  const { editor: providedEditor, hideWhenUnavailable = false, onInserted } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = React.useState(true);
  const canInsert = canInsertImage(editor);
  const isActive = isImageActive(editor);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$4({ editor, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);
  const handleImage = React.useCallback(() => {
    if (!editor) return false;
    const success = insertImage(editor);
    if (success) {
      onInserted?.();
    }
    return success;
  }, [editor, onInserted]);
  useHotkeys(
    IMAGE_UPLOAD_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleImage();
    },
    {
      enabled: isVisible && canInsert,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    },
  );
  return {
    isVisible,
    isActive,
    handleImage,
    canInsert,
    label: "Add image",
    shortcutKeys: IMAGE_UPLOAD_SHORTCUT_KEY,
    Icon: ImagePlusIcon,
  };
}
const CornerDownLeftIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M21 4C21 3.44772 20.5523 3 20 3C19.4477 3 19 3.44772 19 4V11C19 11.7956 18.6839 12.5587 18.1213 13.1213C17.5587 13.6839 16.7956 14 16 14H6.41421L9.70711 10.7071C10.0976 10.3166 10.0976 9.68342 9.70711 9.29289C9.31658 8.90237 8.68342 8.90237 8.29289 9.29289L3.29289 14.2929C2.90237 14.6834 2.90237 15.3166 3.29289 15.7071L8.29289 20.7071C8.68342 21.0976 9.31658 21.0976 9.70711 20.7071C10.0976 20.3166 10.0976 19.6834 9.70711 19.2929L6.41421 16H16C17.3261 16 18.5979 15.4732 19.5355 14.5355C20.4732 13.5979 21 12.3261 21 11V4Z",
      fill: "currentColor",
    }),
  });
});
CornerDownLeftIcon.displayName = "CornerDownLeftIcon";
const ExternalLinkIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M14 3C14 2.44772 14.4477 2 15 2H21C21.5523 2 22 2.44772 22 3V9C22 9.55228 21.5523 10 21 10C20.4477 10 20 9.55228 20 9V5.41421L10.7071 14.7071C10.3166 15.0976 9.68342 15.0976 9.29289 14.7071C8.90237 14.3166 8.90237 13.6834 9.29289 13.2929L18.5858 4H15C14.4477 4 14 3.55228 14 3Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M4.29289 7.29289C4.48043 7.10536 4.73478 7 5 7H11C11.5523 7 12 6.55228 12 6C12 5.44772 11.5523 5 11 5H5C4.20435 5 3.44129 5.31607 2.87868 5.87868C2.31607 6.44129 2 7.20435 2 8V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H16C16.7957 22 17.5587 21.6839 18.1213 21.1213C18.6839 20.5587 19 19.7957 19 19V13C19 12.4477 18.5523 12 18 12C17.4477 12 17 12.4477 17 13V19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V8C4 7.73478 4.10536 7.48043 4.29289 7.29289Z",
        fill: "currentColor",
      }),
    ],
  });
});
ExternalLinkIcon.displayName = "ExternalLinkIcon";
const TrashIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 5V4C7 3.17477 7.40255 2.43324 7.91789 1.91789C8.43324 1.40255 9.17477 1 10 1H14C14.8252 1 15.5668 1.40255 16.0821 1.91789C16.5975 2.43324 17 3.17477 17 4V5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H20V20C20 20.8252 19.5975 21.5668 19.0821 22.0821C18.5668 22.5975 17.8252 23 17 23H7C6.17477 23 5.43324 22.5975 4.91789 22.0821C4.40255 21.5668 4 20.8252 4 20V7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H7ZM9 4C9 3.82523 9.09745 3.56676 9.33211 3.33211C9.56676 3.09745 9.82523 3 10 3H14C14.1748 3 14.4332 3.09745 14.6679 3.33211C14.9025 3.56676 15 3.82523 15 4V5H9V4ZM6 7V20C6 20.1748 6.09745 20.4332 6.33211 20.6679C6.56676 20.9025 6.82523 21 7 21H17C17.1748 21 17.4332 20.9025 17.6679 20.6679C17.9025 20.4332 18 20.1748 18 20V7H6Z",
      fill: "currentColor",
    }),
  });
});
TrashIcon.displayName = "TrashIcon";
function LinkButton({ ref, className, children, ...props }) {
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    className,
    "data-style": "ghost",
    role: "button",
    tabIndex: -1,
    "aria-label": "Link",
    tooltip: "Link",
    ref,
    ...props,
    children: children || /* @__PURE__ */ jsx(LinkIcon, { className: "tiptap-button-icon" }),
  });
}
LinkButton.displayName = "LinkButton";
const LinkMain = ({ url, setUrl, setLink, removeLink, openLink, isActive }) => {
  const isMobile = useIsMobile();
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setLink();
    }
  };
  return /* @__PURE__ */ jsx(Card, {
    style: isMobile ? { boxShadow: "none", border: 0 } : {},
    children: /* @__PURE__ */ jsx(CardBody, {
      children: /* @__PURE__ */ jsxs(CardItemGroup, {
        orientation: "horizontal",
        children: [
          /* @__PURE__ */ jsx(InputGroup, {
            children: /* @__PURE__ */ jsx(Input, {
              type: "url",
              placeholder: "Paste a link...",
              value: url,
              onChange: (e) => setUrl(e.target.value),
              onKeyDown: handleKeyDown,
              autoFocus: true,
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
            }),
          }),
          /* @__PURE__ */ jsx(ButtonGroup, {
            orientation: "horizontal",
            children: /* @__PURE__ */ jsx(Button, {
              type: "button",
              onClick: setLink,
              title: "Apply link",
              disabled: !url && !isActive,
              "data-style": "ghost",
              children: /* @__PURE__ */ jsx(CornerDownLeftIcon, {
                className: "tiptap-button-icon",
              }),
            }),
          }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs(ButtonGroup, {
            orientation: "horizontal",
            children: [
              /* @__PURE__ */ jsx(Button, {
                type: "button",
                onClick: openLink,
                title: "Open in new window",
                disabled: !url && !isActive,
                "data-style": "ghost",
                children: /* @__PURE__ */ jsx(ExternalLinkIcon, {
                  className: "tiptap-button-icon",
                }),
              }),
              /* @__PURE__ */ jsx(Button, {
                type: "button",
                onClick: removeLink,
                title: "Remove link",
                disabled: !url && !isActive,
                "data-style": "ghost",
                children: /* @__PURE__ */ jsx(TrashIcon, { className: "tiptap-button-icon" }),
              }),
            ],
          }),
        ],
      }),
    }),
  });
};
const LinkContent = ({ editor }) => {
  const linkPopover = useLinkPopover({
    editor,
  });
  return /* @__PURE__ */ jsx(LinkMain, { ...linkPopover });
};
function LinkPopover({
  ref,
  editor: providedEditor,
  hideWhenUnavailable = false,
  onSetLink,
  onOpenChange,
  autoOpenOnLinkActive = true,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);
  const { isVisible, canSet, isActive, url, setUrl, setLink, removeLink, openLink, label, Icon } =
    useLinkPopover({
      editor,
      hideWhenUnavailable,
      onSetLink,
    });
  const handleOnOpenChange = React.useCallback(
    (nextIsOpen) => {
      setIsOpen(nextIsOpen);
      onOpenChange?.(nextIsOpen);
    },
    [onOpenChange],
  );
  const handleSetLink = React.useCallback(() => {
    setLink();
    setIsOpen(false);
  }, [setLink]);
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      setIsOpen(!isOpen);
    },
    [onClick, isOpen],
  );
  React.useEffect(() => {
    if (autoOpenOnLinkActive && isActive) {
      setIsOpen(true);
    }
  }, [autoOpenOnLinkActive, isActive]);
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Popover, {
    open: isOpen,
    onOpenChange: handleOnOpenChange,
    children: [
      /* @__PURE__ */ jsx(PopoverTrigger, {
        nativeButton: true,
        render: /* @__PURE__ */ jsx(LinkButton, {
          disabled: !canSet,
          "data-active-state": isActive ? "on" : "off",
          "data-disabled": !canSet,
          "aria-label": label,
          "aria-pressed": isActive,
          onClick: handleClick,
          ...buttonProps,
          ref,
          children: children ?? /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
        }),
      }),
      /* @__PURE__ */ jsx(PopoverContent, {
        className: "p-0",
        children: /* @__PURE__ */ jsx(LinkMain, {
          url,
          setUrl,
          setLink: handleSetLink,
          removeLink,
          openLink,
          isActive,
        }),
      }),
    ],
  });
}
LinkPopover.displayName = "LinkPopover";
function canSetLink(editor) {
  if (!editor || !editor.isEditable) return false;
  return editor.can().setMark("link");
}
function isLinkActive(editor) {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("link");
}
function shouldShowLinkButton(props) {
  const { editor, hideWhenUnavailable } = props;
  const linkInSchema = isMarkInSchema("link", editor);
  if (!linkInSchema || !editor) {
    return false;
  }
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canSetLink(editor);
  }
  return true;
}
function useLinkHandler(props) {
  const { editor, onSetLink } = props;
  const [url, setUrl] = React.useState(null);
  React.useEffect(() => {
    if (!editor) return;
    const { href } = editor.getAttributes("link");
    if (isLinkActive(editor) && url === null) {
      setUrl(href || "");
    }
  }, [editor, url]);
  React.useEffect(() => {
    if (!editor) return;
    const updateLinkState = () => {
      const { href } = editor.getAttributes("link");
      setUrl(href || "");
    };
    editor.on("selectionUpdate", updateLinkState);
    return () => {
      editor.off("selectionUpdate", updateLinkState);
    };
  }, [editor]);
  const setLink = React.useCallback(() => {
    if (!url || !editor) return;
    const { selection } = editor.state;
    const isEmpty = selection.empty;
    let chain = editor.chain().focus();
    chain = chain.extendMarkRange("link").setLink({ href: url });
    if (isEmpty) {
      chain = chain.insertContent({ type: "text", text: url });
    }
    chain.run();
    setUrl(null);
    onSetLink?.();
  }, [editor, onSetLink, url]);
  const removeLink = React.useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .setMeta("preventAutolink", true)
      .run();
    setUrl("");
  }, [editor]);
  const openLink = React.useCallback(
    (target = "_blank", features = "noopener,noreferrer") => {
      if (!url) return;
      const safeUrl = sanitizeUrl(url, window.location.href);
      if (safeUrl !== "#") {
        window.open(safeUrl, target, features);
      }
    },
    [url],
  );
  return {
    url: url || "",
    setUrl,
    setLink,
    removeLink,
    openLink,
  };
}
function useLinkState(props) {
  const { editor, hideWhenUnavailable = false } = props;
  const canSet = canSetLink(editor);
  const isActive = isLinkActive(editor);
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowLinkButton({
          editor,
          hideWhenUnavailable,
        }),
      );
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);
  return {
    isVisible,
    canSet,
    isActive,
  };
}
function useLinkPopover(config) {
  const { editor: providedEditor, hideWhenUnavailable = false, onSetLink } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, canSet, isActive } = useLinkState({
    editor,
    hideWhenUnavailable,
  });
  const linkHandler = useLinkHandler({
    editor,
    onSetLink,
  });
  return {
    isVisible,
    canSet,
    isActive,
    label: "Link",
    Icon: LinkIcon,
    ...linkHandler,
  };
}
function ListShortcutBadge({ type, shortcutKeys = LIST_SHORTCUT_KEYS[type] }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function ListButton({
  ref,
  editor: providedEditor,
  type,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    canToggle: canToggle2,
    isActive,
    handleToggle,
    label,
    shortcutKeys,
    Icon,
  } = useList({
    editor,
    type,
    hideWhenUnavailable,
    onToggled,
  });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleToggle();
    },
    [handleToggle, onClick],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    role: "button",
    tabIndex: -1,
    disabled: !canToggle2,
    "data-disabled": !canToggle2,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: label,
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut && /* @__PURE__ */ jsx(ListShortcutBadge, { type, shortcutKeys }),
        ],
      }),
  });
}
ListButton.displayName = "ListButton";
const ListIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7 6C7 5.44772 7.44772 5 8 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H8C7.44772 7 7 6.55228 7 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7 12C7 11.4477 7.44772 11 8 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H8C7.44772 13 7 12.5523 7 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7 18C7 17.4477 7.44772 17 8 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H8C7.44772 19 7 18.5523 7 18Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 6C2 5.44772 2.44772 5 3 5H3.01C3.56228 5 4.01 5.44772 4.01 6C4.01 6.55228 3.56228 7 3.01 7H3C2.44772 7 2 6.55228 2 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 11.4477 2.44772 11 3 11H3.01C3.56228 11 4.01 11.4477 4.01 12C4.01 12.5523 3.56228 13 3.01 13H3C2.44772 13 2 12.5523 2 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 18C2 17.4477 2.44772 17 3 17H3.01C3.56228 17 4.01 17.4477 4.01 18C4.01 18.5523 3.56228 19 3.01 19H3C2.44772 19 2 18.5523 2 18Z",
        fill: "currentColor",
      }),
    ],
  });
});
ListIcon.displayName = "ListIcon";
const ListOrderedIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9 6C9 5.44772 9.44772 5 10 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H10C9.44772 7 9 6.55228 9 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9 12C9 11.4477 9.44772 11 10 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H10C9.44772 13 9 12.5523 9 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9 18C9 17.4477 9.44772 17 10 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H10C9.44772 19 9 18.5523 9 18Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3 6C3 5.44772 3.44772 5 4 5H5C5.55228 5 6 5.44772 6 6V10C6 10.5523 5.55228 11 5 11C4.44772 11 4 10.5523 4 10V7C3.44772 7 3 6.55228 3 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3 10C3 9.44772 3.44772 9 4 9H6C6.55228 9 7 9.44772 7 10C7 10.5523 6.55228 11 6 11H4C3.44772 11 3 10.5523 3 10Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5.82219 13.0431C6.54543 13.4047 6.99997 14.1319 6.99997 15C6.99997 15.5763 6.71806 16.0426 6.48747 16.35C6.31395 16.5814 6.1052 16.8044 5.91309 17H5.99997C6.55226 17 6.99997 17.4477 6.99997 18C6.99997 18.5523 6.55226 19 5.99997 19H3.99997C3.44769 19 2.99997 18.5523 2.99997 18C2.99997 17.4237 3.28189 16.9575 3.51247 16.65C3.74323 16.3424 4.03626 16.0494 4.26965 15.8161C4.27745 15.8083 4.2852 15.8006 4.29287 15.7929C4.55594 15.5298 4.75095 15.3321 4.88748 15.15C4.96287 15.0495 4.99021 14.9922 4.99911 14.9714C4.99535 14.9112 4.9803 14.882 4.9739 14.8715C4.96613 14.8588 4.95382 14.845 4.92776 14.8319C4.87723 14.8067 4.71156 14.7623 4.44719 14.8944C3.95321 15.1414 3.35254 14.9412 3.10555 14.4472C2.85856 13.9533 3.05878 13.3526 3.55276 13.1056C4.28839 12.7378 5.12272 12.6934 5.82219 13.0431Z",
        fill: "currentColor",
      }),
    ],
  });
});
ListOrderedIcon.displayName = "ListOrderedIcon";
const ListTodoIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 6C2 4.89543 2.89543 4 4 4H8C9.10457 4 10 4.89543 10 6V10C10 11.1046 9.10457 12 8 12H4C2.89543 12 2 11.1046 2 10V6ZM8 6H4V10H8V6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9.70711 14.2929C10.0976 14.6834 10.0976 15.3166 9.70711 15.7071L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071L2.29289 17.7071C1.90237 17.3166 1.90237 16.6834 2.29289 16.2929C2.68342 15.9024 3.31658 15.9024 3.70711 16.2929L5 17.5858L8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 6C12 5.44772 12.4477 5 13 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H13C12.4477 7 12 6.55228 12 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 12C12 11.4477 12.4477 11 13 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H13C12.4477 13 12 12.5523 12 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 18C12 17.4477 12.4477 17 13 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H13C12.4477 19 12 18.5523 12 18Z",
        fill: "currentColor",
      }),
    ],
  });
});
ListTodoIcon.displayName = "ListTodoIcon";
const listIcons = {
  bulletList: ListIcon,
  orderedList: ListOrderedIcon,
  taskList: ListTodoIcon,
};
const listLabels = {
  bulletList: "Bullet List",
  orderedList: "Ordered List",
  taskList: "Task List",
};
const LIST_SHORTCUT_KEYS = {
  bulletList: "mod+shift+8",
  orderedList: "mod+shift+7",
  taskList: "mod+shift+9",
};
function canToggleList(editor, type, turnInto = true) {
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema(type, editor) || isNodeTypeSelected(editor, ["image"])) return false;
  if (!turnInto) {
    switch (type) {
      case "bulletList":
        return editor.can().toggleBulletList();
      case "orderedList":
        return editor.can().toggleOrderedList();
      case "taskList":
        return editor.can().toggleList("taskList", "taskItem");
      default:
        return false;
    }
  }
  try {
    const view = editor.view;
    const state = view.state;
    const selection = state.selection;
    if (selection.empty || selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
function isListActive(editor, type) {
  if (!editor || !editor.isEditable) return false;
  switch (type) {
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    case "taskList":
      return editor.isActive("taskList");
    default:
      return false;
  }
}
function toggleList(editor, type) {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleList(editor, type)) return false;
  try {
    const view = editor.view;
    let state = view.state;
    let tr = state.tr;
    if (state.selection.empty || state.selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos;
      if (!isValidPosition(pos)) return false;
      tr = tr.setSelection(NodeSelection.create(state.doc, pos));
      view.dispatch(tr);
      state = view.state;
    }
    const selection = state.selection;
    let chain = editor.chain().focus();
    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild;
      const lastChild = selection.node.lastChild?.lastChild;
      const from = firstChild ? selection.from + firstChild.nodeSize : selection.from + 1;
      const to = lastChild ? selection.to - lastChild.nodeSize : selection.to - 1;
      chain = chain.setTextSelection({ from, to }).clearNodes();
    }
    if (editor.isActive(type)) {
      chain.liftListItem("listItem").lift("bulletList").lift("orderedList").lift("taskList").run();
    } else {
      const toggleMap = {
        bulletList: () => chain.toggleBulletList(),
        orderedList: () => chain.toggleOrderedList(),
        taskList: () => chain.toggleList("taskList", "taskItem"),
      };
      const toggle = toggleMap[type];
      if (!toggle) return false;
      toggle().run();
    }
    editor.chain().focus().selectTextblockEnd().run();
    return true;
  } catch {
    return false;
  }
}
function shouldShowButton$3(props) {
  const { editor, type, hideWhenUnavailable } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isNodeInSchema(type, editor)) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleList(editor, type);
  }
  return true;
}
function useList(config) {
  const { editor: providedEditor, type, hideWhenUnavailable = false, onToggled } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const canToggle2 = canToggleList(editor, type);
  const isActive = isListActive(editor, type);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$3({ editor, type, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, type, hideWhenUnavailable]);
  const handleToggle = React.useCallback(() => {
    if (!editor) return false;
    const success = toggleList(editor, type);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, type, onToggled]);
  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggle2,
    label: listLabels[type],
    shortcutKeys: LIST_SHORTCUT_KEYS[type],
    Icon: listIcons[type],
  };
}
const listOptions = [
  {
    label: "Bullet List",
    type: "bulletList",
    icon: ListIcon,
  },
  {
    label: "Ordered List",
    type: "orderedList",
    icon: ListOrderedIcon,
  },
  {
    label: "Task List",
    type: "taskList",
    icon: ListTodoIcon,
  },
];
function canToggleAnyList(editor, listTypes) {
  if (!editor || !editor.isEditable) return false;
  return listTypes.some((type) => canToggleList(editor, type));
}
function isAnyListActive(editor, listTypes) {
  if (!editor || !editor.isEditable) return false;
  return listTypes.some((type) => isListActive(editor, type));
}
function getFilteredListOptions(availableTypes) {
  return listOptions.filter((option) => !option.type || availableTypes.includes(option.type));
}
function shouldShowListDropdown(params) {
  const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params;
  if (!listInSchema || !editor) {
    return false;
  }
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleAny;
  }
  return true;
}
function getActiveListType(editor, availableTypes) {
  if (!editor || !editor.isEditable) return void 0;
  return availableTypes.find((type) => isListActive(editor, type));
}
function useListDropdownMenu(config) {
  const {
    editor: providedEditor,
    types = ["bulletList", "orderedList", "taskList"],
    hideWhenUnavailable = false,
  } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(false);
  const listInSchema = types.some((type) => isNodeInSchema(type, editor));
  const filteredLists = React.useMemo(() => getFilteredListOptions(types), [types]);
  const canToggleAny = canToggleAnyList(editor, types);
  const isAnyActive = isAnyListActive(editor, types);
  const activeType = getActiveListType(editor, types);
  const activeList = filteredLists.find((option) => option.type === activeType);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowListDropdown({
          editor,
          hideWhenUnavailable,
          listInSchema,
          canToggleAny,
        }),
      );
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [canToggleAny, editor, hideWhenUnavailable, listInSchema, types]);
  return {
    isVisible,
    activeType,
    isActive: isAnyActive,
    canToggle: canToggleAny,
    types,
    filteredLists,
    label: "List",
    Icon: activeList ? listIcons[activeList.type] : ListIcon,
  };
}
const defaultTypes = ["bulletList", "orderedList", "taskList"];
function ListDropdownMenu({
  editor: providedEditor,
  types = defaultTypes,
  hideWhenUnavailable = false,
  onOpenChange,
  portal = false,
  ...props
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    filteredLists,
    canToggle: canToggle2,
    isActive,
    isVisible,
    Icon,
  } = useListDropdownMenu({
    editor,
    types,
    hideWhenUnavailable,
  });
  const handleOnOpenChange = React.useCallback(
    (open) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange],
  );
  if (!isVisible || !editor || !editor.isEditable) {
    return null;
  }
  return /* @__PURE__ */ jsxs(DropdownMenu, {
    open: isOpen,
    onOpenChange: handleOnOpenChange,
    children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, {
        nativeButton: true,
        render: /* @__PURE__ */ jsxs(Button, {
          className: "tiptap-button",
          type: "button",
          "data-style": "ghost",
          "data-active-state": isActive ? "on" : "off",
          role: "button",
          tabIndex: -1,
          disabled: !canToggle2,
          "data-disabled": !canToggle2,
          "aria-label": "List options",
          tooltip: "List",
          ...props,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
            /* @__PURE__ */ jsx(ChevronDownIcon, { className: "tiptap-button-dropdown-small" }),
          ],
        }),
      }),
      /* @__PURE__ */ jsx(DropdownMenuPortal, {
        children: /* @__PURE__ */ jsx(DropdownMenuContent, {
          align: "start",
          portal,
          children: /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsx(CardBody, {
              children: /* @__PURE__ */ jsx(ButtonGroup, {
                children: filteredLists.map((option) =>
                  /* @__PURE__ */ jsx(
                    DropdownMenuItem,
                    {
                      nativeButton: true,
                      render: /* @__PURE__ */ jsx(ListButton, {
                        editor,
                        type: option.type,
                        text: option.label,
                        showTooltip: false,
                      }),
                    },
                    option.type,
                  ),
                ),
              }),
            }),
          }),
        }),
      }),
    ],
  });
}
function MarkShortcutBadge({ type, shortcutKeys = MARK_SHORTCUT_KEYS[type] }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function MarkButton({
  ref,
  editor: providedEditor,
  type,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const {
    isVisible,
    handleMark,
    label,
    canToggle: canToggle2,
    isActive,
    Icon,
    shortcutKeys,
  } = useMark({
    editor,
    type,
    hideWhenUnavailable,
    onToggled,
  });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleMark();
    },
    [handleMark, onClick],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    disabled: !canToggle2,
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    "data-disabled": !canToggle2,
    role: "button",
    tabIndex: -1,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: label,
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut && /* @__PURE__ */ jsx(MarkShortcutBadge, { type, shortcutKeys }),
        ],
      }),
  });
}
MarkButton.displayName = "MarkButton";
const BoldIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6 2.5C5.17157 2.5 4.5 3.17157 4.5 4V20C4.5 20.8284 5.17157 21.5 6 21.5H15C16.4587 21.5 17.8576 20.9205 18.8891 19.8891C19.9205 18.8576 20.5 17.4587 20.5 16C20.5 14.5413 19.9205 13.1424 18.8891 12.1109C18.6781 11.9 18.4518 11.7079 18.2128 11.5359C19.041 10.5492 19.5 9.29829 19.5 8C19.5 6.54131 18.9205 5.14236 17.8891 4.11091C16.8576 3.07946 15.4587 2.5 14 2.5H6ZM14 10.5C14.663 10.5 15.2989 10.2366 15.7678 9.76777C16.2366 9.29893 16.5 8.66304 16.5 8C16.5 7.33696 16.2366 6.70107 15.7678 6.23223C15.2989 5.76339 14.663 5.5 14 5.5H7.5V10.5H14ZM7.5 18.5V13.5H15C15.663 13.5 16.2989 13.7634 16.7678 14.2322C17.2366 14.7011 17.5 15.337 17.5 16C17.5 16.663 17.2366 17.2989 16.7678 17.7678C16.2989 18.2366 15.663 18.5 15 18.5H7.5Z",
      fill: "currentColor",
    }),
  });
});
BoldIcon.displayName = "BoldIcon";
const Code2Icon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M15.4545 4.2983C15.6192 3.77115 15.3254 3.21028 14.7983 3.04554C14.2712 2.88081 13.7103 3.1746 13.5455 3.70175L8.54554 19.7017C8.38081 20.2289 8.6746 20.7898 9.20175 20.9545C9.72889 21.1192 10.2898 20.8254 10.4545 20.2983L15.4545 4.2983Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M6.70711 7.29289C7.09763 7.68342 7.09763 8.31658 6.70711 8.70711L3.41421 12L6.70711 15.2929C7.09763 15.6834 7.09763 16.3166 6.70711 16.7071C6.31658 17.0976 5.68342 17.0976 5.29289 16.7071L1.29289 12.7071C0.902369 12.3166 0.902369 11.6834 1.29289 11.2929L5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M17.2929 7.29289C17.6834 6.90237 18.3166 6.90237 18.7071 7.29289L22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L18.7071 16.7071C18.3166 17.0976 17.6834 17.0976 17.2929 16.7071C16.9024 16.3166 16.9024 15.6834 17.2929 15.2929L20.5858 12L17.2929 8.70711C16.9024 8.31658 16.9024 7.68342 17.2929 7.29289Z",
        fill: "currentColor",
      }),
    ],
  });
});
Code2Icon.displayName = "Code2Icon";
const ItalicIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      d: "M15.0222 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H15.693L10.443 19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H9.02418C9.00802 21.0004 8.99181 21.0004 8.97557 21H5C4.44772 21 4 20.5523 4 20C4 19.4477 4.44772 19 5 19H8.30704L13.557 5H10C9.44772 5 9 4.55228 9 4C9 3.44772 9.44772 3 10 3H14.9782C14.9928 2.99968 15.0075 2.99967 15.0222 3Z",
      fill: "currentColor",
    }),
  });
});
ItalicIcon.displayName = "ItalicIcon";
const StrikeIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M9.00039 3H16.0001C16.5524 3 17.0001 3.44772 17.0001 4C17.0001 4.55229 16.5524 5 16.0001 5H9.00011C8.68006 4.99983 8.36412 5.07648 8.07983 5.22349C7.79555 5.37051 7.55069 5.5836 7.36585 5.84487C7.181 6.10614 7.06155 6.40796 7.01754 6.72497C6.97352 7.04198 7.00623 7.36492 7.11292 7.66667C7.29701 8.18737 7.02414 8.75872 6.50344 8.94281C5.98274 9.1269 5.4114 8.85403 5.2273 8.33333C5.01393 7.72984 4.94851 7.08396 5.03654 6.44994C5.12456 5.81592 5.36346 5.21229 5.73316 4.68974C6.10285 4.1672 6.59256 3.74101 7.16113 3.44698C7.72955 3.15303 8.36047 2.99975 9.00039 3Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M18 13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H14C14.7956 13 15.5587 13.3161 16.1213 13.8787C16.6839 14.4413 17 15.2044 17 16C17 16.7956 16.6839 17.5587 16.1213 18.1213C15.5587 18.6839 14.7956 19 14 19H6C5.44772 19 5 19.4477 5 20C5 20.5523 5.44772 21 6 21H14C15.3261 21 16.5979 20.4732 17.5355 19.5355C18.4732 18.5979 19 17.3261 19 16C19 14.9119 18.6453 13.8604 18 13Z",
        fill: "currentColor",
      }),
    ],
  });
});
StrikeIcon.displayName = "StrikeIcon";
const SubscriptIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L12.7071 15.2929C13.0976 15.6834 13.0976 16.3166 12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L3.29289 8.70711C2.90237 8.31658 2.90237 7.68342 3.29289 7.29289Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.7071 7.29289C13.0976 7.68342 13.0976 8.31658 12.7071 8.70711L4.70711 16.7071C4.31658 17.0976 3.68342 17.0976 3.29289 16.7071C2.90237 16.3166 2.90237 15.6834 3.29289 15.2929L11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M17.4079 14.3995C18.0284 14.0487 18.7506 13.9217 19.4536 14.0397C20.1566 14.1578 20.7977 14.5138 21.2696 15.0481L21.2779 15.0574L21.2778 15.0575C21.7439 15.5988 22 16.2903 22 17C22 18.0823 21.3962 18.8401 20.7744 19.3404C20.194 19.8073 19.4858 20.141 18.9828 20.378C18.9638 20.387 18.9451 20.3958 18.9266 20.4045C18.4473 20.6306 18.2804 20.7817 18.1922 20.918C18.1773 20.9412 18.1619 20.9681 18.1467 21H21C21.5523 21 22 21.4477 22 22C22 22.5523 21.5523 23 21 23H17C16.4477 23 16 22.5523 16 22C16 21.1708 16.1176 20.4431 16.5128 19.832C16.9096 19.2184 17.4928 18.8695 18.0734 18.5956C18.6279 18.334 19.138 18.0901 19.5207 17.7821C19.8838 17.49 20 17.2477 20 17C20 16.7718 19.9176 16.5452 19.7663 16.3672C19.5983 16.1792 19.3712 16.0539 19.1224 16.0121C18.8722 15.9701 18.6152 16.015 18.3942 16.1394C18.1794 16.2628 18.0205 16.4549 17.9422 16.675C17.7572 17.1954 17.1854 17.4673 16.665 17.2822C16.1446 17.0972 15.8728 16.5254 16.0578 16.005C16.2993 15.3259 16.7797 14.7584 17.4039 14.4018L17.4079 14.3995L17.4079 14.3995Z",
        fill: "currentColor",
      }),
    ],
  });
});
SubscriptIcon.displayName = "SubscriptIcon";
const SuperscriptIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.7071 7.29289C13.0976 7.68342 13.0976 8.31658 12.7071 8.70711L4.70711 16.7071C4.31658 17.0976 3.68342 17.0976 3.29289 16.7071C2.90237 16.3166 2.90237 15.6834 3.29289 15.2929L11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L12.7071 15.2929C13.0976 15.6834 13.0976 16.3166 12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L3.29289 8.70711C2.90237 8.31658 2.90237 7.68342 3.29289 7.29289Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M17.405 1.40657C18.0246 1.05456 18.7463 0.92634 19.4492 1.04344C20.1521 1.16054 20.7933 1.51583 21.2652 2.0497L21.2697 2.05469L21.2696 2.05471C21.7431 2.5975 22 3.28922 22 4.00203C22 5.08579 21.3952 5.84326 20.7727 6.34289C20.1966 6.80531 19.4941 7.13675 18.9941 7.37261C18.9714 7.38332 18.9491 7.39383 18.9273 7.40415C18.4487 7.63034 18.2814 7.78152 18.1927 7.91844C18.1778 7.94155 18.1625 7.96834 18.1473 8.00003H21C21.5523 8.00003 22 8.44774 22 9.00003C22 9.55231 21.5523 10 21 10H17C16.4477 10 16 9.55231 16 9.00003C16 8.17007 16.1183 7.44255 16.5138 6.83161C16.9107 6.21854 17.4934 5.86971 18.0728 5.59591C18.6281 5.33347 19.1376 5.09075 19.5208 4.78316C19.8838 4.49179 20 4.25026 20 4.00203C20 3.77192 19.9178 3.54865 19.7646 3.37182C19.5968 3.18324 19.3696 3.05774 19.1205 3.01625C18.8705 2.97459 18.6137 3.02017 18.3933 3.14533C18.1762 3.26898 18.0191 3.45826 17.9406 3.67557C17.7531 4.19504 17.18 4.46414 16.6605 4.27662C16.141 4.0891 15.8719 3.51596 16.0594 2.99649C16.303 2.3219 16.7817 1.76125 17.4045 1.40689L17.405 1.40657Z",
        fill: "currentColor",
      }),
    ],
  });
});
SuperscriptIcon.displayName = "SuperscriptIcon";
const UnderlineIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 4C7 3.44772 6.55228 3 6 3C5.44772 3 5 3.44772 5 4V10C5 11.8565 5.7375 13.637 7.05025 14.9497C8.36301 16.2625 10.1435 17 12 17C13.8565 17 15.637 16.2625 16.9497 14.9497C18.2625 13.637 19 11.8565 19 10V4C19 3.44772 18.5523 3 18 3C17.4477 3 17 3.44772 17 4V10C17 11.3261 16.4732 12.5979 15.5355 13.5355C14.5979 14.4732 13.3261 15 12 15C10.6739 15 9.40215 14.4732 8.46447 13.5355C7.52678 12.5979 7 11.3261 7 10V4ZM4 19C3.44772 19 3 19.4477 3 20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19H4Z",
      fill: "currentColor",
    }),
  });
});
UnderlineIcon.displayName = "UnderlineIcon";
const markIcons = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strike: StrikeIcon,
  code: Code2Icon,
  superscript: SuperscriptIcon,
  subscript: SubscriptIcon,
};
const MARK_SHORTCUT_KEYS = {
  bold: "mod+b",
  italic: "mod+i",
  underline: "mod+u",
  strike: "mod+shift+s",
  code: "mod+e",
  superscript: "mod+.",
  subscript: "mod+,",
};
function canToggleMark(editor, type) {
  if (!editor || !editor.isEditable) return false;
  if (!isMarkInSchema(type, editor) || isNodeTypeSelected(editor, ["image"])) return false;
  return editor.can().toggleMark(type);
}
function isMarkActive(editor, type) {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive(type);
}
function toggleMark(editor, type) {
  if (!editor || !editor.isEditable) return false;
  if (!canToggleMark(editor, type)) return false;
  return editor.chain().focus().toggleMark(type).run();
}
function shouldShowButton$2(props) {
  const { editor, type, hideWhenUnavailable } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isMarkInSchema(type, editor)) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleMark(editor, type);
  }
  return true;
}
function getFormattedMarkName(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
function useMark(config) {
  const { editor: providedEditor, type, hideWhenUnavailable = false, onToggled } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const canToggle2 = canToggleMark(editor, type);
  const isActive = isMarkActive(editor, type);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$2({ editor, type, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, type, hideWhenUnavailable]);
  const handleMark = React.useCallback(() => {
    if (!editor) return false;
    const success = toggleMark(editor, type);
    if (success) {
      onToggled?.();
    }
    return success;
  }, [editor, type, onToggled]);
  return {
    isVisible,
    isActive,
    handleMark,
    canToggle: canToggle2,
    label: getFormattedMarkName(type),
    shortcutKeys: MARK_SHORTCUT_KEYS[type],
    Icon: markIcons[type],
  };
}
function TextAlignShortcutBadge({ align, shortcutKeys = TEXT_ALIGN_SHORTCUT_KEYS[align] }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function TextAlignButton({
  ref,
  editor: providedEditor,
  align,
  text,
  hideWhenUnavailable = false,
  onAligned,
  showShortcut = false,
  onClick,
  icon: CustomIcon,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, handleTextAlign, label, canAlign, isActive, Icon, shortcutKeys } =
    useTextAlign({
      editor,
      align,
      hideWhenUnavailable,
      onAligned,
    });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleTextAlign();
    },
    [handleTextAlign, onClick],
  );
  if (!isVisible) {
    return null;
  }
  const RenderIcon = CustomIcon ?? Icon;
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    disabled: !canAlign,
    "data-style": "ghost",
    "data-active-state": isActive ? "on" : "off",
    "data-disabled": !canAlign,
    role: "button",
    tabIndex: -1,
    "aria-label": label,
    "aria-pressed": isActive,
    tooltip: label,
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(RenderIcon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut &&
            /* @__PURE__ */ jsx(TextAlignShortcutBadge, {
              align,
              shortcutKeys,
            }),
        ],
      }),
  });
}
TextAlignButton.displayName = "TextAlignButton";
const AlignCenterIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z",
        fill: "currentColor",
      }),
    ],
  });
});
AlignCenterIcon.displayName = "AlignCenterIcon";
const AlignJustifyIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 18C2 17.4477 2.44772 17 3 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18Z",
        fill: "currentColor",
      }),
    ],
  });
});
AlignJustifyIcon.displayName = "AlignJustifyIcon";
const AlignLeftIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 12C2 11.4477 2.44772 11 3 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H3C2.44772 13 2 12.5523 2 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 18C2 17.4477 2.44772 17 3 17H17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19H3C2.44772 19 2 18.5523 2 18Z",
        fill: "currentColor",
      }),
    ],
  });
});
AlignLeftIcon.displayName = "AlignLeftIcon";
const AlignRightIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8 12C8 11.4477 8.44772 11 9 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H9C8.44772 13 8 12.5523 8 12Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6 18C6 17.4477 6.44772 17 7 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H7C6.44772 19 6 18.5523 6 18Z",
        fill: "currentColor",
      }),
    ],
  });
});
AlignRightIcon.displayName = "AlignRightIcon";
const TEXT_ALIGN_SHORTCUT_KEYS = {
  left: "mod+shift+l",
  center: "mod+shift+e",
  right: "mod+shift+r",
  justify: "mod+shift+j",
};
const textAlignIcons = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};
const textAlignLabels = {
  left: "Align left",
  center: "Align center",
  right: "Align right",
  justify: "Align justify",
};
function canSetTextAlign(editor, align) {
  if (!editor || !editor.isEditable) return false;
  if (
    !isExtensionAvailable(editor, "textAlign") ||
    isNodeTypeSelected(editor, ["image", "horizontalRule"])
  ) {
    return false;
  }
  return editor.can().setTextAlign(align);
}
function hasSetTextAlign(commands) {
  return "setTextAlign" in commands;
}
function isTextAlignActive(editor, align) {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive({ textAlign: align });
}
function setTextAlign(editor, align) {
  if (!editor || !editor.isEditable) return false;
  if (!canSetTextAlign(editor, align)) return false;
  const chain = editor.chain().focus();
  if (hasSetTextAlign(chain)) {
    return chain.setTextAlign(align).run();
  }
  return false;
}
function shouldShowButton$1(props) {
  const { editor, hideWhenUnavailable, align } = props;
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "textAlign")) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canSetTextAlign(editor, align);
  }
  return true;
}
function useTextAlign(config) {
  const { editor: providedEditor, align, hideWhenUnavailable = false, onAligned } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const canAlign = canSetTextAlign(editor, align);
  const isActive = isTextAlignActive(editor, align);
  React.useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton$1({ editor, align, hideWhenUnavailable }));
    };
    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, align]);
  const handleTextAlign = React.useCallback(() => {
    if (!editor) return false;
    const success = setTextAlign(editor, align);
    if (success) {
      onAligned?.();
    }
    return success;
  }, [editor, align, onAligned]);
  return {
    isVisible,
    isActive,
    handleTextAlign,
    canAlign,
    label: textAlignLabels[align],
    shortcutKeys: TEXT_ALIGN_SHORTCUT_KEYS[align],
    Icon: textAlignIcons[align],
  };
}
function HistoryShortcutBadge({ action, shortcutKeys = UNDO_REDO_SHORTCUT_KEYS[action] }) {
  return /* @__PURE__ */ jsx(Badge, { children: parseShortcutKeys({ shortcutKeys }) });
}
function UndoRedoButton({
  ref,
  editor: providedEditor,
  action,
  text,
  hideWhenUnavailable = false,
  onExecuted,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}) {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, handleAction, label, canExecute, Icon, shortcutKeys } = useUndoRedo({
    editor,
    action,
    hideWhenUnavailable,
    onExecuted,
  });
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleAction();
    },
    [handleAction, onClick],
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsx(Button, {
    type: "button",
    disabled: !canExecute,
    "data-style": "ghost",
    "data-disabled": !canExecute,
    role: "button",
    tabIndex: -1,
    "aria-label": label,
    tooltip: label,
    onClick: handleClick,
    ...buttonProps,
    ref,
    children:
      children ??
      /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "tiptap-button-icon" }),
          text && /* @__PURE__ */ jsx("span", { className: "tiptap-button-text", children: text }),
          showShortcut &&
            /* @__PURE__ */ jsx(HistoryShortcutBadge, {
              action,
              shortcutKeys,
            }),
        ],
      }),
  });
}
UndoRedoButton.displayName = "UndoRedoButton";
const Redo2Icon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M15.7071 2.29289C15.3166 1.90237 14.6834 1.90237 14.2929 2.29289C13.9024 2.68342 13.9024 3.31658 14.2929 3.70711L17.5858 7H9.5C7.77609 7 6.12279 7.68482 4.90381 8.90381C3.68482 10.1228 3 11.7761 3 13.5C3 14.3536 3.16813 15.1988 3.49478 15.9874C3.82144 16.7761 4.30023 17.4926 4.90381 18.0962C6.12279 19.3152 7.77609 20 9.5 20H13C13.5523 20 14 19.5523 14 19C14 18.4477 13.5523 18 13 18H9.5C8.30653 18 7.16193 17.5259 6.31802 16.682C5.90016 16.2641 5.56869 15.768 5.34254 15.2221C5.1164 14.6761 5 14.0909 5 13.5C5 12.3065 5.47411 11.1619 6.31802 10.318C7.16193 9.47411 8.30653 9 9.5 9H17.5858L14.2929 12.2929C13.9024 12.6834 13.9024 13.3166 14.2929 13.7071C14.6834 14.0976 15.3166 14.0976 15.7071 13.7071L20.7071 8.70711C21.0976 8.31658 21.0976 7.68342 20.7071 7.29289L15.7071 2.29289Z",
      fill: "currentColor",
    }),
  });
});
Redo2Icon.displayName = "Redo2Icon";
const Undo2Icon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.70711 3.70711C10.0976 3.31658 10.0976 2.68342 9.70711 2.29289C9.31658 1.90237 8.68342 1.90237 8.29289 2.29289L3.29289 7.29289C2.90237 7.68342 2.90237 8.31658 3.29289 8.70711L8.29289 13.7071C8.68342 14.0976 9.31658 14.0976 9.70711 13.7071C10.0976 13.3166 10.0976 12.6834 9.70711 12.2929L6.41421 9H14.5C15.0909 9 15.6761 9.1164 16.2221 9.34254C16.768 9.56869 17.2641 9.90016 17.682 10.318C18.0998 10.7359 18.4313 11.232 18.6575 11.7779C18.8836 12.3239 19 12.9091 19 13.5C19 14.0909 18.8836 14.6761 18.6575 15.2221C18.4313 15.768 18.0998 16.2641 17.682 16.682C17.2641 17.0998 16.768 17.4313 16.2221 17.6575C15.6761 17.8836 15.0909 18 14.5 18H11C10.4477 18 10 18.4477 10 19C10 19.5523 10.4477 20 11 20H14.5C15.3536 20 16.1988 19.8319 16.9874 19.5052C17.7761 19.1786 18.4926 18.6998 19.0962 18.0962C19.6998 17.4926 20.1786 16.7761 20.5052 15.9874C20.8319 15.1988 21 14.3536 21 13.5C21 12.6464 20.8319 11.8012 20.5052 11.0126C20.1786 10.2239 19.6998 9.50739 19.0962 8.90381C18.4926 8.30022 17.7761 7.82144 16.9874 7.49478C16.1988 7.16813 15.3536 7 14.5 7H6.41421L9.70711 3.70711Z",
      fill: "currentColor",
    }),
  });
});
Undo2Icon.displayName = "Undo2Icon";
const UNDO_REDO_SHORTCUT_KEYS = {
  undo: "mod+z",
  redo: "mod+shift+z",
};
const historyActionLabels = {
  undo: "Undo",
  redo: "Redo",
};
const historyIcons = {
  undo: Undo2Icon,
  redo: Redo2Icon,
};
function canExecuteUndoRedoAction(editor, action) {
  if (!editor || !editor.isEditable) return false;
  if (isNodeTypeSelected(editor, ["image"])) return false;
  return action === "undo" ? editor.can().undo() : editor.can().redo();
}
function executeUndoRedoAction(editor, action) {
  if (!editor || !editor.isEditable) return false;
  if (!canExecuteUndoRedoAction(editor, action)) return false;
  const chain = editor.chain().focus();
  return action === "undo" ? chain.undo().run() : chain.redo().run();
}
function shouldShowButton(props) {
  const { editor, hideWhenUnavailable, action } = props;
  if (!editor || !editor.isEditable) return false;
  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canExecuteUndoRedoAction(editor, action);
  }
  return true;
}
function useUndoRedo(config) {
  const { editor: providedEditor, action, hideWhenUnavailable = false, onExecuted } = config;
  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(true);
  const canExecute = canExecuteUndoRedoAction(editor, action);
  React.useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable, action }));
    };
    handleUpdate();
    editor.on("transaction", handleUpdate);
    return () => {
      editor.off("transaction", handleUpdate);
    };
  }, [editor, hideWhenUnavailable, action]);
  const handleAction = React.useCallback(() => {
    if (!editor) return false;
    const success = executeUndoRedoAction(editor, action);
    if (success) {
      onExecuted?.();
    }
    return success;
  }, [editor, action, onExecuted]);
  return {
    isVisible,
    handleAction,
    canExecute,
    label: historyActionLabels[action],
    shortcutKeys: UNDO_REDO_SHORTCUT_KEYS[action],
    Icon: historyIcons[action],
  };
}
function useUnmount(callback) {
  const ref = useRef(callback);
  ref.current = callback;
  useEffect(
    () => () => {
      ref.current();
    },
    [],
  );
}
const defaultOptions = {
  leading: false,
  trailing: true,
};
function useThrottledCallback(fn, wait = 250, dependencies = [], options = defaultOptions) {
  const handler = React.useMemo(
    () => throttle(fn, wait, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies,
  );
  useUnmount(() => {
    handler.cancel();
  });
  return handler;
}
function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: 0,
    height: 0,
    offsetTop: 0,
    offsetLeft: 0,
    scale: 0,
  });
  const handleViewportChange = useThrottledCallback(() => {
    if (typeof window === "undefined") return;
    const vp = window.visualViewport;
    if (!vp) return;
    const { width = 0, height = 0, offsetTop = 0, offsetLeft = 0, scale = 0 } = vp;
    setWindowSize((prevState) => {
      if (
        width === prevState.width &&
        height === prevState.height &&
        offsetTop === prevState.offsetTop &&
        offsetLeft === prevState.offsetLeft &&
        scale === prevState.scale
      ) {
        return prevState;
      }
      return { width, height, offsetTop, offsetLeft, scale };
    });
  }, 200);
  React.useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;
    visualViewport.addEventListener("resize", handleViewportChange);
    handleViewportChange();
    return () => {
      visualViewport.removeEventListener("resize", handleViewportChange);
    };
  }, [handleViewportChange]);
  return windowSize;
}
const initialRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
const isSSR = typeof window === "undefined";
const hasResizeObserver = !isSSR && typeof ResizeObserver !== "undefined";
const isClientSide = () => !isSSR;
function useElementRect({
  element,
  enabled = true,
  throttleMs = 100,
  useResizeObserver = true,
} = {}) {
  const [rect, setRect] = React.useState(initialRect);
  const getTargetElement = React.useCallback(() => {
    if (!enabled || !isClientSide()) return null;
    if (!element) {
      return document.body;
    }
    if (typeof element === "string") {
      return document.querySelector(element);
    }
    if ("current" in element) {
      return element.current;
    }
    return element;
  }, [element, enabled]);
  const updateRect = useThrottledCallback(
    () => {
      if (!enabled || !isClientSide()) return;
      const targetElement = getTargetElement();
      if (!targetElement) {
        setRect(initialRect);
        return;
      }
      const newRect = targetElement.getBoundingClientRect();
      setRect({
        x: newRect.x,
        y: newRect.y,
        width: newRect.width,
        height: newRect.height,
        top: newRect.top,
        right: newRect.right,
        bottom: newRect.bottom,
        left: newRect.left,
      });
    },
    throttleMs,
    [enabled, getTargetElement],
    { leading: true, trailing: true },
  );
  React.useEffect(() => {
    if (!enabled || !isClientSide()) {
      setRect(initialRect);
      return;
    }
    const targetElement = getTargetElement();
    if (!targetElement) return;
    updateRect();
    const cleanup = [];
    if (useResizeObserver && hasResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(updateRect);
      });
      resizeObserver.observe(targetElement);
      cleanup.push(() => resizeObserver.disconnect());
    }
    const handleUpdate = () => updateRect();
    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate, { passive: true });
    cleanup.push(() => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    });
    return () => {
      cleanup.forEach((fn) => fn());
      setRect(initialRect);
    };
  }, [enabled, getTargetElement, updateRect, useResizeObserver]);
  return rect;
}
function useBodyRect(options = {}) {
  return useElementRect({
    ...options,
    element: isClientSide() ? document.body : null,
  });
}
function useCursorVisibility({ editor, overlayHeight = 0 }) {
  const { height: windowHeight } = useWindowSize();
  const rect = useBodyRect({
    enabled: true,
    throttleMs: 100,
    useResizeObserver: true,
  });
  React.useEffect(() => {
    const ensureCursorVisibility = () => {
      if (!editor) return;
      const { state, view } = editor;
      if (!view.hasFocus()) return;
      const { from } = state.selection;
      const cursorCoords = view.coordsAtPos(from);
      if (windowHeight < rect.height && cursorCoords) {
        const availableSpace = windowHeight - cursorCoords.top;
        if (availableSpace < overlayHeight) {
          const targetCursorY = Math.max(windowHeight / 2, overlayHeight);
          const currentScrollY = window.scrollY;
          const cursorAbsoluteY = cursorCoords.top + currentScrollY;
          const newScrollY = cursorAbsoluteY - targetCursorY;
          window.scrollTo({
            top: Math.max(0, newScrollY),
            behavior: "smooth",
          });
        }
      }
    };
    ensureCursorVisibility();
  }, [editor, overlayHeight, windowHeight, rect.height]);
  return rect;
}
function MainToolbarContent({ onHighlighterClick, onLinkClick, isMobile }) {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx(Spacer, {}),
      /* @__PURE__ */ jsxs(ToolbarGroup, {
        children: [
          /* @__PURE__ */ jsx(UndoRedoButton, { action: "undo" }),
          /* @__PURE__ */ jsx(UndoRedoButton, { action: "redo" }),
        ],
      }),
      /* @__PURE__ */ jsx(ToolbarSeparator, {}),
      /* @__PURE__ */ jsxs(ToolbarGroup, {
        children: [
          /* @__PURE__ */ jsx(HeadingDropdownMenu, { levels: [1, 2, 3, 4], portal: isMobile }),
          /* @__PURE__ */ jsx(ListDropdownMenu, {
            types: ["bulletList", "orderedList", "taskList"],
            portal: isMobile,
          }),
          /* @__PURE__ */ jsx(BlockquoteButton, {}),
          /* @__PURE__ */ jsx(CodeBlockButton, {}),
        ],
      }),
      /* @__PURE__ */ jsx(ToolbarSeparator, {}),
      /* @__PURE__ */ jsxs(ToolbarGroup, {
        children: [
          /* @__PURE__ */ jsx(MarkButton, { type: "bold" }),
          /* @__PURE__ */ jsx(MarkButton, { type: "italic" }),
          /* @__PURE__ */ jsx(MarkButton, { type: "strike" }),
          /* @__PURE__ */ jsx(MarkButton, { type: "code" }),
          /* @__PURE__ */ jsx(MarkButton, { type: "underline" }),
          !isMobile
            ? /* @__PURE__ */ jsx(ColorHighlightPopover, {})
            : /* @__PURE__ */ jsx(ColorHighlightPopoverButton, { onClick: onHighlighterClick }),
          !isMobile
            ? /* @__PURE__ */ jsx(LinkPopover, {})
            : /* @__PURE__ */ jsx(LinkButton, { onClick: onLinkClick }),
        ],
      }),
      /* @__PURE__ */ jsx(ToolbarSeparator, {}),
      /* @__PURE__ */ jsxs(ToolbarGroup, {
        children: [
          /* @__PURE__ */ jsx(MarkButton, { type: "superscript" }),
          /* @__PURE__ */ jsx(MarkButton, { type: "subscript" }),
        ],
      }),
      /* @__PURE__ */ jsx(ToolbarSeparator, {}),
      /* @__PURE__ */ jsxs(ToolbarGroup, {
        children: [
          /* @__PURE__ */ jsx(TextAlignButton, { align: "left" }),
          /* @__PURE__ */ jsx(TextAlignButton, { align: "center" }),
          /* @__PURE__ */ jsx(TextAlignButton, { align: "right" }),
          /* @__PURE__ */ jsx(TextAlignButton, { align: "justify" }),
        ],
      }),
      /* @__PURE__ */ jsx(ToolbarSeparator, {}),
      /* @__PURE__ */ jsxs(ToolbarGroup, {
        children: [
          /* @__PURE__ */ jsx(BookmarkButton, {}),
          /* @__PURE__ */ jsx(IFrameButton, {}),
          /* @__PURE__ */ jsx(ImageUploadButton, { text: "Add" }),
        ],
      }),
      /* @__PURE__ */ jsx(Spacer, {}),
      isMobile && /* @__PURE__ */ jsx(ToolbarSeparator, {}),
    ],
  });
}
function MobileToolbarContent({ type, onBack }) {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx(ToolbarGroup, {
        children: /* @__PURE__ */ jsxs(Button, {
          "data-style": "ghost",
          onClick: onBack,
          children: [
            /* @__PURE__ */ jsx(ArrowLeftIcon, { className: "tiptap-button-icon" }),
            type === "highlighter"
              ? /* @__PURE__ */ jsx(HighlighterIcon, { className: "tiptap-button-icon" })
              : /* @__PURE__ */ jsx(LinkIcon, { className: "tiptap-button-icon" }),
          ],
        }),
      }),
      /* @__PURE__ */ jsx(ToolbarSeparator, {}),
      type === "highlighter"
        ? /* @__PURE__ */ jsx(ColorHighlightPopoverContent, {})
        : /* @__PURE__ */ jsx(LinkContent, {}),
    ],
  });
}
function Editor({ editor }) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState("main");
  const toolbarRef = React.useRef(null);
  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });
  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);
  return /* @__PURE__ */ jsx("div", {
    className: "editor relative",
    children: /* @__PURE__ */ jsxs(EditorContext, {
      value: { editor },
      children: [
        /* @__PURE__ */ jsx(Toolbar, {
          ref: toolbarRef,
          style: isMobile
            ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
            : {},
          children:
            mobileView === "main"
              ? /* @__PURE__ */ jsx(MainToolbarContent, {
                  onHighlighterClick: () => setMobileView("highlighter"),
                  onLinkClick: () => setMobileView("link"),
                  isMobile,
                })
              : /* @__PURE__ */ jsx(MobileToolbarContent, {
                  type: mobileView === "highlighter" ? "highlighter" : "link",
                  onBack: () => setMobileView("main"),
                }),
        }),
        /* @__PURE__ */ jsx(EditorContent, {
          editor,
          role: "presentation",
          className: "simple-editor-content",
        }),
      ],
    }),
  });
}
function NativeSelect({ className, size = "default", ...props }) {
  return /* @__PURE__ */ jsxs("div", {
    className: cn$1(
      "group/native-select relative w-fit has-[select:disabled]:opacity-50",
      className,
    ),
    "data-slot": "native-select-wrapper",
    "data-size": size,
    children: [
      /* @__PURE__ */ jsx("select", {
        "data-slot": "native-select",
        "data-size": size,
        className:
          "border-input bg-input/30 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 w-full min-w-0 appearance-none rounded-4xl border py-1 pr-8 pl-3 text-sm transition-colors select-none focus-visible:ring-[3px] aria-invalid:ring-[3px] data-[size=sm]:h-8 outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
        ...props,
      }),
      /* @__PURE__ */ jsx(ChevronDownIcon$1, {
        className:
          "text-muted-foreground top-1/2 right-3.5 size-4 -translate-y-1/2 pointer-events-none absolute select-none",
        "aria-hidden": "true",
        "data-slot": "native-select-icon",
      }),
    ],
  });
}
function NativeSelectOption({ ...props }) {
  return /* @__PURE__ */ jsx("option", { "data-slot": "native-select-option", ...props });
}
const BookmarkNodeView = React.memo(
  ({ node }) => {
    const { url, title, description, image, siteName, favicon } = node.attrs;
    const handleClick = () => {
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    };
    return /* @__PURE__ */ jsx(NodeViewWrapper, {
      className: "bookmark-node",
      children: /* @__PURE__ */ jsx("div", {
        className: "bookmark-card h-30",
        onClick: handleClick,
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        },
        children: /* @__PURE__ */ jsxs("div", {
          className: "bookmark-content",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "bookmark-info",
              children: [
                /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-2",
                  children: [
                    (siteName || favicon) &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "bookmark-site",
                        children: [
                          favicon &&
                            /* @__PURE__ */ jsx("img", {
                              src: favicon,
                              alt: "",
                              className: "bookmark-favicon",
                              onError: (e) => {
                                e.currentTarget.style.display = "none";
                              },
                            }),
                          siteName &&
                            /* @__PURE__ */ jsx("span", {
                              className: "bookmark-site-name",
                              children: siteName,
                            }),
                        ],
                      }),
                    title &&
                      /* @__PURE__ */ jsx("div", { className: "bookmark-title", children: title }),
                  ],
                }),
                description &&
                  /* @__PURE__ */ jsx("div", {
                    className: "bookmark-description text-xs!",
                    children: description,
                  }),
                /* @__PURE__ */ jsx("div", { className: "bookmark-url", children: url }),
              ],
            }),
            image &&
              /* @__PURE__ */ jsx("div", {
                className: "bookmark-image-container",
                children: /* @__PURE__ */ jsx("img", {
                  src: image,
                  alt: title || "",
                  className: "bookmark-image",
                  onError: (e) => {
                    e.currentTarget.parentElement.style.display = "none";
                  },
                }),
              }),
          ],
        }),
      }),
    });
  },
  (prev, next) => prev.node.attrs.url === next.node.attrs.url,
);
const BookmarkNode = Node.create({
  name: "bookmark",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      url: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-url"),
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-title"),
      },
      description: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-description"),
      },
      image: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-image"),
      },
      siteName: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-site-name"),
      },
      favicon: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-favicon"),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="bookmark"]',
      },
    ];
  },
  renderHTML({ node }) {
    const { url, title, description, image, siteName, favicon } = node.attrs;
    const children = [
      "a",
      {
        class: "bookmark-card h-30 block ",
        style: "text-decoration:none",
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      [
        "div",
        { class: "bookmark-content" },
        [
          "div",
          { class: "bookmark-info no-underline" },
          [
            "div",
            { class: "flex gap-2" },
            ...(siteName || favicon
              ? [
                  [
                    "div",
                    { class: "bookmark-site" },
                    ...(favicon
                      ? [["img", { src: favicon, alt: "", class: "bookmark-favicon" }]]
                      : []),
                    ...(siteName ? [["span", { class: "bookmark-site-name" }, siteName]] : []),
                  ],
                ]
              : []),
            ...(title ? [["div", { class: "bookmark-title " }, title]] : []),
          ],
          ...(description
            ? [["div", { class: "bookmark-description text-xs! " }, description]]
            : []),
          ["div", { class: "bookmark-url" }, url],
        ],
        ...(image
          ? [
              [
                "div",
                { class: "bookmark-image-container" },
                ["img", { src: image, alt: title || "", class: "bookmark-image" }],
              ],
            ]
          : []),
      ],
    ];
    return [
      "div",
      {
        "data-type": "bookmark",
        "data-url": url,
        "data-title": title,
        "data-description": description,
        "data-image": image,
        "data-site-name": siteName,
        "data-favicon": favicon,
        class: "bookmark-node",
      },
      children,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(BookmarkNodeView);
  },
  addCommands() {
    return {
      setBookmark:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
const HorizontalRule = TiptapHorizontalRule.extend({
  renderHTML() {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, { "data-type": this.name }),
      ["hr"],
    ];
  },
});
const IFrameNodeView = React.memo(
  ({ node }) => {
    const { code } = node.attrs;
    return /* @__PURE__ */ jsx(NodeViewWrapper, {
      className: "iframe-node",
      children: /* @__PURE__ */ jsx("div", {
        className: "iframe-container",
        dangerouslySetInnerHTML: { __html: code },
      }),
    });
  },
  (prev, next) => prev.node.attrs.code === next.node.attrs.code,
);
const IFrameNode = Node.create({
  name: "iframe",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      code: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-code"),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="iframe"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const container = element.querySelector(".iframe-container");
          const code =
            container?.getAttribute("data-iframe-html") ||
            container?.innerHTML ||
            element.getAttribute("data-code") ||
            "";
          return { code };
        },
      },
    ];
  },
  renderHTML({ node }) {
    const code = node.attrs.code || "";
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = code;
    const iframeElement = tempContainer.firstChild;
    return [
      "div",
      {
        "data-type": "iframe",
        "data-code": code,
        class: "iframe-node",
      },
      iframeElement || "",
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(IFrameNodeView);
  },
  addCommands() {
    return {
      setIFrame:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
const CloseIcon = React.memo(({ className, ...props }) => {
  return /* @__PURE__ */ jsx("svg", {
    width: "24",
    height: "24",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx("path", {
      d: "M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z",
      fill: "currentColor",
    }),
  });
});
CloseIcon.displayName = "CloseIcon";
function useFileUpload(options) {
  const [fileItems, setFileItems] = React.useState([]);
  const uploadFile = async (file) => {
    if (file.size > options.maxSize) {
      const error = new Error(
        `File size exceeds maximum allowed (${options.maxSize / 1024 / 1024}MB)`,
      );
      options.onError?.(error);
      return null;
    }
    const abortController = new AbortController();
    const fileId = crypto.randomUUID();
    const newFileItem = {
      id: fileId,
      file,
      progress: 0,
      status: "uploading",
      abortController,
    };
    setFileItems((prev) => [...prev, newFileItem]);
    try {
      if (!options.upload) {
        throw new Error("Upload function is not defined");
      }
      const url = await options.upload(
        file,
        (event) => {
          setFileItems((prev) =>
            prev.map((item) => (item.id === fileId ? { ...item, progress: event.progress } : item)),
          );
        },
        abortController.signal,
      );
      if (!url) throw new Error("Upload failed: No URL returned");
      if (!abortController.signal.aborted) {
        setFileItems((prev) =>
          prev.map((item) =>
            item.id === fileId ? { ...item, status: "success", url, progress: 100 } : item,
          ),
        );
        options.onSuccess?.(url);
        return url;
      }
      return null;
    } catch (error) {
      if (!abortController.signal.aborted) {
        setFileItems((prev) =>
          prev.map((item) =>
            item.id === fileId ? { ...item, status: "error", progress: 0 } : item,
          ),
        );
        options.onError?.(error instanceof Error ? error : new Error("Upload failed"));
      }
      return null;
    }
  };
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) {
      options.onError?.(new Error("No files to upload"));
      return [];
    }
    if (options.limit && files.length > options.limit) {
      options.onError?.(
        new Error(`Maximum ${options.limit} file${options.limit === 1 ? "" : "s"} allowed`),
      );
      return [];
    }
    const uploadPromises = files.map((file) => uploadFile(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null);
  };
  const removeFileItem = (fileId) => {
    setFileItems((prev) => {
      const fileToRemove = prev.find((item) => item.id === fileId);
      if (fileToRemove?.abortController) {
        fileToRemove.abortController.abort();
      }
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter((item) => item.id !== fileId);
    });
  };
  const clearAllFiles = () => {
    fileItems.forEach((item) => {
      if (item.abortController) {
        item.abortController.abort();
      }
      if (item.url) {
        URL.revokeObjectURL(item.url);
      }
    });
    setFileItems([]);
  };
  return {
    fileItems,
    uploadFiles,
    removeFileItem,
    clearAllFiles,
  };
}
const CloudUploadIcon = () =>
  /* @__PURE__ */ jsxs("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    className: "tiptap-image-upload-icon",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsx("path", {
        d: "M11.1953 4.41771C10.3478 4.08499 9.43578 3.94949 8.5282 4.02147C7.62062 4.09345 6.74133 4.37102 5.95691 4.83316C5.1725 5.2953 4.50354 5.92989 4.00071 6.68886C3.49788 7.44783 3.17436 8.31128 3.05465 9.2138C2.93495 10.1163 3.0222 11.0343 3.3098 11.8981C3.5974 12.7619 4.07781 13.5489 4.71463 14.1995C5.10094 14.5942 5.09414 15.2274 4.69945 15.6137C4.30476 16 3.67163 15.9932 3.28532 15.5985C2.43622 14.731 1.79568 13.6816 1.41221 12.5299C1.02875 11.3781 0.91241 10.1542 1.07201 8.95084C1.23162 7.74748 1.66298 6.59621 2.33343 5.58425C3.00387 4.57229 3.89581 3.72617 4.9417 3.10998C5.98758 2.4938 7.15998 2.1237 8.37008 2.02773C9.58018 1.93176 10.7963 2.11243 11.9262 2.55605C13.0561 2.99968 14.0703 3.69462 14.8919 4.58825C15.5423 5.29573 16.0585 6.11304 16.4177 7.00002H17.4999C18.6799 6.99991 19.8288 7.37933 20.7766 8.08222C21.7245 8.78515 22.4212 9.7743 22.7637 10.9036C23.1062 12.0328 23.0765 13.2423 22.6788 14.3534C22.2812 15.4644 21.5367 16.4181 20.5554 17.0736C20.0962 17.3803 19.4752 17.2567 19.1684 16.7975C18.8617 16.3382 18.9853 15.7172 19.4445 15.4105C20.069 14.9934 20.5427 14.3865 20.7958 13.6794C21.0488 12.9724 21.0678 12.2027 20.8498 11.4841C20.6318 10.7655 20.1885 10.136 19.5853 9.6887C18.9821 9.24138 18.251 8.99993 17.5001 9.00002H15.71C15.2679 9.00002 14.8783 8.70973 14.7518 8.28611C14.4913 7.41374 14.0357 6.61208 13.4195 5.94186C12.8034 5.27164 12.0427 4.75043 11.1953 4.41771Z",
        fill: "currentColor",
      }),
      /* @__PURE__ */ jsx("path", {
        d: "M11 14.4142V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V14.4142L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L12.7078 11.2936C12.7054 11.2912 12.703 11.2888 12.7005 11.2864C12.5208 11.1099 12.2746 11.0008 12.003 11L12 11L11.997 11C11.8625 11.0004 11.7343 11.0273 11.6172 11.0759C11.502 11.1236 11.3938 11.1937 11.2995 11.2864C11.297 11.2888 11.2946 11.2912 11.2922 11.2936L7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071C7.68342 17.0976 8.31658 17.0976 8.70711 16.7071L11 14.4142Z",
        fill: "currentColor",
      }),
    ],
  });
const FileIcon = () =>
  /* @__PURE__ */ jsx("svg", {
    width: "43",
    height: "57",
    viewBox: "0 0 43 57",
    fill: "currentColor",
    className: "tiptap-image-upload-dropzone-rect-primary",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", {
      d: "M0.75 10.75C0.75 5.64137 4.89137 1.5 10 1.5H32.3431C33.2051 1.5 34.0317 1.84241 34.6412 2.4519L40.2981 8.10876C40.9076 8.71825 41.25 9.5449 41.25 10.4069V46.75C41.25 51.8586 37.1086 56 32 56H10C4.89137 56 0.75 51.8586 0.75 46.75V10.75Z",
      fill: "currentColor",
      fillOpacity: "0.11",
      stroke: "currentColor",
      strokeWidth: "1.5",
    }),
  });
const FileCornerIcon = () =>
  /* @__PURE__ */ jsx("svg", {
    width: "10",
    height: "10",
    className: "tiptap-image-upload-dropzone-rect-secondary",
    viewBox: "0 0 10 10",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", {
      d: "M0 0.75H0.343146C1.40401 0.75 2.42143 1.17143 3.17157 1.92157L8.82843 7.57843C9.57857 8.32857 10 9.34599 10 10.4069V10.75H4C1.79086 10.75 0 8.95914 0 6.75V0.75Z",
      fill: "currentColor",
    }),
  });
const ImageUploadDragArea = ({ onFile, children }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragActive(false);
      setIsDragOver(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFile(files);
    }
  };
  return /* @__PURE__ */ jsx("div", {
    className: `tiptap-image-upload-drag-area ${isDragActive ? "drag-active" : ""} ${isDragOver ? "drag-over" : ""}`,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    children,
  });
};
const ImageUploadPreview = ({ fileItem, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "tiptap-image-upload-preview",
    children: [
      fileItem.status === "uploading" &&
        /* @__PURE__ */ jsx("div", {
          className: "tiptap-image-upload-progress",
          style: { width: `${fileItem.progress}%` },
        }),
      /* @__PURE__ */ jsxs("div", {
        className: "tiptap-image-upload-preview-content",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "tiptap-image-upload-file-info",
            children: [
              /* @__PURE__ */ jsx("div", {
                className: "tiptap-image-upload-file-icon",
                children: /* @__PURE__ */ jsx(CloudUploadIcon, {}),
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "tiptap-image-upload-details",
                children: [
                  /* @__PURE__ */ jsx("span", {
                    className: "tiptap-image-upload-text",
                    children: fileItem.file.name,
                  }),
                  /* @__PURE__ */ jsx("span", {
                    className: "tiptap-image-upload-subtext",
                    children: formatFileSize(fileItem.file.size),
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "tiptap-image-upload-actions",
            children: [
              fileItem.status === "uploading" &&
                /* @__PURE__ */ jsxs("span", {
                  className: "tiptap-image-upload-progress-text",
                  children: [fileItem.progress, "%"],
                }),
              /* @__PURE__ */ jsx(Button, {
                type: "button",
                "data-style": "ghost",
                onClick: (e) => {
                  e.stopPropagation();
                  onRemove();
                },
                children: /* @__PURE__ */ jsx(CloseIcon, { className: "tiptap-button-icon" }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
const DropZoneContent = ({ maxSize, limit }) =>
  /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "tiptap-image-upload-dropzone",
        children: [
          /* @__PURE__ */ jsx(FileIcon, {}),
          /* @__PURE__ */ jsx(FileCornerIcon, {}),
          /* @__PURE__ */ jsx("div", {
            className: "tiptap-image-upload-icon-container",
            children: /* @__PURE__ */ jsx(CloudUploadIcon, {}),
          }),
        ],
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "tiptap-image-upload-content",
        children: [
          /* @__PURE__ */ jsxs("span", {
            className: "tiptap-image-upload-text",
            children: [
              /* @__PURE__ */ jsx("em", { children: "Click to upload" }),
              " ",
              "or drag and drop",
            ],
          }),
          /* @__PURE__ */ jsxs("span", {
            className: "tiptap-image-upload-subtext",
            children: [
              "Maximum",
              " ",
              limit,
              " ",
              "file",
              limit === 1 ? "" : "s",
              ",",
              " ",
              maxSize / 1024 / 1024,
              "MB each.",
            ],
          }),
        ],
      }),
    ],
  });
const ImageUploadNode$1 = (props) => {
  const { accept, limit, maxSize } = props.node.attrs;
  const inputRef = React.useRef(null);
  const extension = props.extension;
  const uploadOptions = {
    maxSize,
    limit,
    accept,
    upload: extension.options.upload,
    onSuccess: extension.options.onSuccess,
    onError: extension.options.onError,
  };
  const { fileItems, uploadFiles, removeFileItem, clearAllFiles } = useFileUpload(uploadOptions);
  const handleUpload = async (files) => {
    const urls = await uploadFiles(files);
    if (urls.length > 0) {
      const pos = props.getPos();
      if (isValidPosition(pos)) {
        const imageNodes = urls.map((url, index) => {
          const filename = files[index]?.name.replace(/\.[^/.]+$/, "") || "unknown";
          return {
            type: extension.options.type,
            attrs: {
              ...extension.options,
              src: url,
              alt: filename,
              title: filename,
            },
          };
        });
        props.editor
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + props.node.nodeSize })
          .insertContentAt(pos, imageNodes)
          .run();
        focusNextNode(props.editor);
      }
    }
  };
  const handleChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      extension.options.onError?.(new Error("No file selected"));
      return;
    }
    handleUpload(Array.from(files));
  };
  const handleClick = () => {
    if (inputRef.current && fileItems.length === 0) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };
  const hasFiles = fileItems.length > 0;
  return /* @__PURE__ */ jsxs(NodeViewWrapper, {
    className: "tiptap-image-upload",
    tabIndex: 0,
    onClick: handleClick,
    children: [
      !hasFiles &&
        /* @__PURE__ */ jsx(ImageUploadDragArea, {
          onFile: handleUpload,
          children: /* @__PURE__ */ jsx(DropZoneContent, { maxSize, limit }),
        }),
      hasFiles &&
        /* @__PURE__ */ jsxs("div", {
          className: "tiptap-image-upload-previews",
          children: [
            fileItems.length > 1 &&
              /* @__PURE__ */ jsxs("div", {
                className: "tiptap-image-upload-header",
                children: [
                  /* @__PURE__ */ jsxs("span", {
                    children: ["Uploading", fileItems.length, " ", "files"],
                  }),
                  /* @__PURE__ */ jsx(Button, {
                    type: "button",
                    "data-style": "ghost",
                    onClick: (e) => {
                      e.stopPropagation();
                      clearAllFiles();
                    },
                    children: "Clear All",
                  }),
                ],
              }),
            fileItems.map((fileItem) =>
              /* @__PURE__ */ jsx(
                ImageUploadPreview,
                {
                  fileItem,
                  onRemove: () => removeFileItem(fileItem.id),
                },
                fileItem.id,
              ),
            ),
          ],
        }),
      /* @__PURE__ */ jsx("input", {
        ref: inputRef,
        name: "file",
        accept,
        type: "file",
        multiple: limit > 1,
        onChange: handleChange,
        onClick: (e) => e.stopPropagation(),
      }),
    ],
  });
};
const ImageUploadNode = Node.create({
  name: "imageUpload",
  group: "block",
  draggable: true,
  selectable: true,
  atom: true,
  addOptions() {
    return {
      type: "image",
      accept: "image/*",
      limit: 1,
      maxSize: 0,
      upload: void 0,
      onError: void 0,
      onSuccess: void 0,
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      accept: {
        default: this.options.accept,
      },
      limit: {
        default: this.options.limit,
      },
      maxSize: {
        default: this.options.maxSize,
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "image-upload" }, HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadNode$1);
  },
  addCommands() {
    return {
      setImageUploadNode:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
  /**
   * Adds Enter key handler to trigger the upload component when it's selected.
   */
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { nodeAfter } = selection.$from;
        if (nodeAfter && nodeAfter.type.name === "imageUpload" && editor.isActive("imageUpload")) {
          const nodeEl = editor.view.nodeDOM(selection.$from.pos);
          if (nodeEl && nodeEl instanceof HTMLElement) {
            const firstChild = nodeEl.firstChild;
            if (firstChild && firstChild instanceof HTMLElement) {
              firstChild.click();
              return true;
            }
          }
        }
        return false;
      },
    };
  },
});
const defaultEditorOptions = {
  immediatelyRender: false,
  shouldRerenderOnTransaction: false,
  editorProps: {
    attributes: {
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
      "aria-label": "Main content area, start typing to enter text.",
      class: "simple-editor",
    },
  },
  extensions: [
    StarterKit.configure({
      horizontalRule: false,
      link: {
        openOnClick: false,
        enableClickSelection: true,
      },
    }),
    HorizontalRule,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
    ImageUploadNode.configure({
      accept: "image/*",
      maxSize: MAX_FILE_SIZE,
      limit: 3,
      upload: handleImageUpload,
      onError: (error) => console.error("Upload failed:", error),
    }),
    BookmarkNode,
    IFrameNode,
  ],
};
function useEditor(options = defaultEditorOptions) {
  return useEditor$1(options);
}
function UpsertEditor(props) {
  const { id } = props;
  const editor = useEditor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const { data: post } = useQuery({
    enabled: !isNil(id),
    queryKey: ["post-detail", id],
    queryFn() {
      return parseResponse(
        hono.api.posts[":id"].$get({
          param: { id },
        }),
      );
    },
  });
  const form = useForm({
    defaultValues: {
      title: post?.data?.title ?? "",
      description: post?.data?.description ?? "",
      slug: post?.data?.slug ?? "",
      banner:
        post?.data?.banner ??
        "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      summary: post?.data?.summary ?? "",
      published: post?.data?.published ?? false,
    },
    async onSubmit({ value }) {
      const htmlContent = editor.getHTML();
      const jsonContent = editor.getJSON();
      const submitData = {
        ...value,
        htmlContent,
        jsonContent,
      };
      if (id) {
        return handleUpdate(submitData);
      } else {
        return handleCreate(submitData);
      }
    },
  });
  async function handleCreate(submitData) {
    try {
      const resp = await parseResponse(
        hono.api.posts.$post({
          json: submitData,
        }),
      );
      if (resp.data.id) {
        toast.success("文章创建成功");
        navigate({ to: "/studio/posts/upsert/$id", params: { id: resp.data.id } });
      }
    } catch (err) {
      toast.error("文章创建失败");
      throw err;
    }
  }
  async function handleUpdate(submitData) {
    try {
      const resp = await parseResponse(
        hono.api.posts.$put({
          json: {
            ...submitData,
            id,
          },
        }),
      );
      if (resp.data.id) {
        toast.success("文章更新成功");
        queryClient.invalidateQueries({ queryKey: ["post-detail", id] });
      }
    } catch (err) {
      toast.error("文章更新失败");
      throw err;
    }
  }
  const autoSave = useCallback(async () => {
    if (!id) return;
    const formValues = form.state.values;
    const htmlContent = editor.getHTML();
    const jsonContent = editor.getJSON();
    try {
      setIsSaving(true);
      await parseResponse(
        hono.api.posts.$put({
          json: {
            ...formValues,
            htmlContent,
            jsonContent,
            id,
          },
        }),
      );
    } catch (err) {
      console.error("自动保存失败:", err);
      toast.error("自动保存失败");
    } finally {
      setIsSaving(false);
    }
  }, [id, editor, form.state.values]);
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2e3);
  }, [autoSave]);
  useHotkeys(
    "mod+s",
    (e) => {
      e.preventDefault();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      autoSave();
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
      preventDefault: true,
    },
  );
  useEffect(() => {
    if (!editor || !id) return;
    const handleUpdate2 = () => {
      triggerAutoSave();
    };
    editor.on("update", handleUpdate2);
    return () => {
      editor.off("update", handleUpdate2);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editor, id, triggerAutoSave]);
  useEffect(() => {
    if (post?.data && isInitialLoadRef.current && editor) {
      editor.commands.setContent(post.data.htmlContent);
      isInitialLoadRef.current = false;
    }
  }, [editor, post]);
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col md:flex-row h-[calc(100vh-82px)] overflow-hidden",
    children: [
      /* @__PURE__ */ jsx("div", {
        className:
          "editor-form w-full md:w-xs overflow-y-auto md:order-2 border-b md:border-b-0 md:border-l border-(--tt-toolbar-border-color)",
        children: /* @__PURE__ */ jsx("div", {
          className: "md:sticky md:top-0 p-2 bg-[--tt-background-color]",
          children: /* @__PURE__ */ jsx("form", {
            onSubmit: (e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            },
            children: /* @__PURE__ */ jsx(FieldSet, {
              children: /* @__PURE__ */ jsxs(FieldGroup, {
                children: [
                  /* @__PURE__ */ jsx(form.Field, {
                    name: "banner",
                    children: (field) => {
                      return /* @__PURE__ */ jsxs(Field, {
                        children: [
                          /* @__PURE__ */ jsx(FieldLabel, { children: "Banner" }),
                          /* @__PURE__ */ jsx(BannerUpload, {
                            value: field.state.value,
                            onChange: (value) => {
                              field.handleChange(value);
                              triggerAutoSave();
                            },
                            onError: (error) => console.error("Banner upload error:", error),
                          }),
                          /* @__PURE__ */ jsx(FieldError, { errors: field.state.meta.errors }),
                        ],
                      });
                    },
                  }),
                  /* @__PURE__ */ jsx(form.Field, {
                    name: "title",
                    children: (field) => {
                      const inValid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return /* @__PURE__ */ jsxs(Field, {
                        "data-invalid": inValid,
                        children: [
                          /* @__PURE__ */ jsx(FieldLabel, { children: "Title" }),
                          /* @__PURE__ */ jsx(InputGroup$1, {
                            children: /* @__PURE__ */ jsx(InputGroupInput, {
                              placeholder: "请输入标题",
                              value: field.state.value,
                              onChange: (e) => {
                                field.handleChange(e.target.value);
                                triggerAutoSave();
                              },
                            }),
                          }),
                          /* @__PURE__ */ jsx(FieldError, { errors: field.state.meta.errors }),
                        ],
                      });
                    },
                  }),
                  /* @__PURE__ */ jsx(form.Field, {
                    name: "slug",
                    children: (field) => {
                      const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return /* @__PURE__ */ jsxs(Field, {
                        "data-invalid": isValid,
                        children: [
                          /* @__PURE__ */ jsx(FieldLabel, { children: "Slug" }),
                          /* @__PURE__ */ jsx(InputGroup$1, {
                            children: /* @__PURE__ */ jsx(InputGroupInput, {
                              placeholder: "请输入slug",
                              value: field.state.value,
                              onChange: (e) => {
                                field.handleChange(e.target.value);
                                triggerAutoSave();
                              },
                            }),
                          }),
                          /* @__PURE__ */ jsx(FieldError, { errors: field.state.meta.errors }),
                        ],
                      });
                    },
                  }),
                  /* @__PURE__ */ jsx(form.Field, {
                    name: "description",
                    children: (field) => {
                      const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return /* @__PURE__ */ jsxs(Field, {
                        "data-invalid": isValid,
                        children: [
                          /* @__PURE__ */ jsx(FieldLabel, { children: "Description" }),
                          /* @__PURE__ */ jsx(InputGroup$1, {
                            children: /* @__PURE__ */ jsx(InputGroupTextarea, {
                              placeholder: "请输入Description",
                              value: field.state.value,
                              onChange: (e) => {
                                field.handleChange(e.target.value);
                                triggerAutoSave();
                              },
                            }),
                          }),
                          /* @__PURE__ */ jsx(FieldError, { errors: field.state.meta.errors }),
                        ],
                      });
                    },
                  }),
                  /* @__PURE__ */ jsx(form.Field, {
                    name: "summary",
                    children: (field) => {
                      const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return /* @__PURE__ */ jsxs(Field, {
                        "data-invalid": isValid,
                        children: [
                          /* @__PURE__ */ jsx(FieldLabel, { children: "Summary" }),
                          /* @__PURE__ */ jsxs(InputGroup$1, {
                            children: [
                              /* @__PURE__ */ jsx(InputGroupTextarea, {
                                placeholder: "请输入Summary",
                                value: field.state.value,
                                onChange: (e) => {
                                  field.handleChange(e.target.value);
                                  triggerAutoSave();
                                },
                              }),
                              /* @__PURE__ */ jsx(InputGroupAddon, {
                                align: "block-end",
                                children: /* @__PURE__ */ jsx("div", {
                                  className: "flex w-full justify-end",
                                  children: /* @__PURE__ */ jsxs(Button$1, {
                                    variant: "ghost",
                                    size: "sm",
                                    className: "rounded-full",
                                    children: [
                                      /* @__PURE__ */ jsx(Sparkles, { className: "size-4" }),
                                      " ",
                                      "AI Generate",
                                    ],
                                  }),
                                }),
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsx(FieldError, { errors: field.state.meta.errors }),
                        ],
                      });
                    },
                  }),
                  /* @__PURE__ */ jsx(form.Field, {
                    name: "published",
                    children: (field) => {
                      return /* @__PURE__ */ jsxs(Field, {
                        children: [
                          /* @__PURE__ */ jsx(FieldLabel, { children: "Published" }),
                          /* @__PURE__ */ jsxs(NativeSelect, {
                            value: field.state.value ? "true" : "false",
                            onChange: (event) => {
                              field.handleChange(event.target.value === "true");
                              triggerAutoSave();
                            },
                            children: [
                              /* @__PURE__ */ jsx(NativeSelectOption, {
                                value: "false",
                                children: "Draft",
                              }),
                              /* @__PURE__ */ jsx(NativeSelectOption, {
                                value: "true",
                                children: "Published",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsx(FieldError, { errors: field.state.meta.errors }),
                        ],
                      });
                    },
                  }),
                ],
              }),
            }),
          }),
        }),
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex-1 overflow-y-auto md:order-1 relative",
        children: [
          isSaving &&
            /* @__PURE__ */ jsxs("div", {
              className:
                "fixed top-30 left-0 right-0 w-fit mx-auto z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsx(Spinner, { className: "size-3" }),
                /* @__PURE__ */ jsx("span", { children: "Saving..." }),
              ],
            }),
          /* @__PURE__ */ jsx(Editor, { editor }),
        ],
      }),
    ],
  });
}
function StudioPostUpsertPage() {
  const { id } = Route.useParams();
  return /* @__PURE__ */ jsx(StudioShell, {
    children: /* @__PURE__ */ jsx(AdminContainer, {
      className: "h-full",
      children: /* @__PURE__ */ jsx(UpsertEditor, { id }),
    }),
  });
}
export { StudioPostUpsertPage as component };
