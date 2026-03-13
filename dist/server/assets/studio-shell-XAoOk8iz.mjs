import { jsx, jsxs } from "react/jsx-runtime";
import { Selection, TextSelection, NodeSelection } from "@tiptap/pm/state";
import { hc } from "hono/client";
import { S as ScrollArea } from "./scroll-area-BzCNRtjT.mjs";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { XIcon, PanelLeftIcon, LayoutDashboard, PencilLine, Folder, CitrusIcon, Moon, Sun } from "lucide-react";
import * as React from "react";
import { B as Button } from "./button-IvqLSGSY.mjs";
import { c as cn$1 } from "./utils-H80jjgLf.mjs";
import { Dialog } from "@base-ui/react/dialog";
import { Tooltip as Tooltip$1 } from "@base-ui/react/tooltip";
import { useNavigate, useLocation, Link } from "@tanstack/react-router";
import { Avatar as Avatar$1 } from "@base-ui/react/avatar";
import { Menu } from "@base-ui/react/menu";
import { u as useSession, a as authClient } from "./auth-client-BQ73uQ-S.mjs";
import { useTheme } from "next-themes";
hc("/");
function hcWithType(...args) {
  return hc(...args);
}
const hono = hcWithType("/", {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include"
    });
  })
});
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAC_SYMBOLS = {
  mod: "⌘",
  command: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  option: "⌥",
  shift: "⇧",
  backspace: "Del",
  delete: "⌦",
  enter: "⏎",
  escape: "⎋",
  capslock: "⇪"
};
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function isMac() {
  return typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac");
}
function formatShortcutKey(key, isMac2, capitalize = true) {
  if (isMac2) {
    const lowerKey = key.toLowerCase();
    return MAC_SYMBOLS[lowerKey] || (capitalize ? key.toUpperCase() : key);
  }
  return capitalize ? key.charAt(0).toUpperCase() + key.slice(1) : key;
}
function parseShortcutKeys(props) {
  const { shortcutKeys, delimiter = "+", capitalize = true } = props;
  if (!shortcutKeys)
    return [];
  return shortcutKeys.split(delimiter).map((key) => key.trim()).map((key) => formatShortcutKey(key, isMac(), capitalize));
}
function isMarkInSchema(markName, editor) {
  if (!editor?.schema)
    return false;
  return editor.schema.spec.marks.get(markName) !== void 0;
}
function isNodeInSchema(nodeName, editor) {
  if (!editor?.schema)
    return false;
  return editor.schema.spec.nodes.get(nodeName) !== void 0;
}
function focusNextNode(editor) {
  const { state, view } = editor;
  const { doc, selection } = state;
  const nextSel = Selection.findFrom(selection.$to, 1, true);
  if (nextSel) {
    view.dispatch(state.tr.setSelection(nextSel).scrollIntoView());
    return true;
  }
  const paragraphType = state.schema.nodes.paragraph;
  if (!paragraphType) {
    console.warn("No paragraph node type found in schema.");
    return false;
  }
  const end = doc.content.size;
  const para = paragraphType.create();
  let tr = state.tr.insert(end, para);
  const $inside = tr.doc.resolve(end + 1);
  tr = tr.setSelection(TextSelection.near($inside)).scrollIntoView();
  view.dispatch(tr);
  return true;
}
function isValidPosition(pos) {
  return typeof pos === "number" && pos >= 0;
}
function isExtensionAvailable(editor, extensionNames) {
  if (!editor)
    return false;
  const names = Array.isArray(extensionNames) ? extensionNames : [extensionNames];
  const found = names.some(
    (name) => editor.extensionManager.extensions.some((ext) => ext.name === name)
  );
  if (!found) {
    console.warn(
      `None of the extensions [${names.join(", ")}] were found in the editor schema. Ensure they are included in the editor configuration.`
    );
  }
  return found;
}
function findNodeAtPosition(editor, position) {
  try {
    const node = editor.state.doc.nodeAt(position);
    if (!node) {
      console.warn(`No node found at position ${position}`);
      return null;
    }
    return node;
  } catch (error) {
    console.error(`Error getting node at position ${position}:`, error);
    return null;
  }
}
function findNodePosition(props) {
  const { editor, node, nodePos } = props;
  if (!editor || !editor.state?.doc)
    return null;
  const hasValidNode = node !== void 0 && node !== null;
  const hasValidPos = isValidPosition(nodePos);
  if (!hasValidNode && !hasValidPos) {
    return null;
  }
  if (hasValidNode) {
    let foundPos = -1;
    let foundNode = null;
    editor.state.doc.descendants((currentNode, pos) => {
      if (currentNode === node) {
        foundPos = pos;
        foundNode = currentNode;
        return false;
      }
      return true;
    });
    if (foundPos !== -1 && foundNode !== null) {
      return { pos: foundPos, node: foundNode };
    }
  }
  if (hasValidPos) {
    const nodeAtPos = findNodeAtPosition(editor, nodePos);
    if (nodeAtPos) {
      return { pos: nodePos, node: nodeAtPos };
    }
  }
  return null;
}
function isNodeTypeSelected(editor, types = []) {
  if (!editor || !editor.state.selection)
    return false;
  const { state } = editor;
  const { selection } = state;
  if (selection.empty)
    return false;
  if (selection instanceof NodeSelection) {
    const node = selection.node;
    return node ? types.includes(node.type.name) : false;
  }
  return false;
}
async function handleImageUpload(file, onProgress, abortSignal) {
  if (!file) {
    throw new Error("No file provided");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`
    );
  }
  if (abortSignal?.aborted) {
    throw new Error("Upload cancelled");
  }
  try {
    onProgress?.({ progress: 0 });
    const response = await hono.api.s3["presigned-url"].$post({
      json: {
        fileName: file.name,
        fileType: file.type
      }
    });
    if (!response.ok) {
      throw new Error("Failed to get upload URL");
    }
    const data = await response.json();
    if (!data.success) {
      const errorMsg = "error" in data && typeof data.error === "string" ? data.error : "Failed to get upload URL";
      throw new Error(errorMsg);
    }
    const { uploadUrl, fileUrl } = data;
    if (abortSignal?.aborted) {
      throw new Error("Upload cancelled");
    }
    onProgress?.({ progress: 30 });
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type
      },
      signal: abortSignal
    });
    if (!uploadResponse.ok) {
      throw new Error("File upload failed");
    }
    onProgress?.({ progress: 100 });
    return fileUrl;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Upload cancelled");
    }
    throw error;
  }
}
const ATTR_WHITESPACE = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g;
function isAllowedUri(uri, protocols) {
  const allowedProtocols = [
    "http",
    "https",
    "ftp",
    "ftps",
    "mailto",
    "tel",
    "callto",
    "sms",
    "cid",
    "xmpp"
  ];
  return !uri || uri.replace(ATTR_WHITESPACE, "").match(
    new RegExp(
      `^(?:(?:${allowedProtocols.join("|")}):|[^a-z]|[a-z0-9+.-]+(?:[^a-z+.-:]|$))`,
      "i"
    )
  );
}
function sanitizeUrl(inputUrl, baseUrl, protocols) {
  try {
    const url = new URL(inputUrl, baseUrl);
    if (isAllowedUri(url.href, protocols)) {
      return url.href;
    }
  } catch {
  }
  return "#";
}
function AdminContainer(props) {
  const { className, ...restProps } = props;
  return /* @__PURE__ */ jsx("div", { className: cn("admin-container pt-2", className), ...restProps });
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(Dialog.Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({ ...props }) {
  return /* @__PURE__ */ jsx(Dialog.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Dialog.Backdrop,
    {
      "data-slot": "sheet-overlay",
      className: cn$1("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/80 duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50", className),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      Dialog.Popup,
      {
        "data-slot": "sheet-content",
        "data-side": side,
        className: cn$1("bg-background data-open:animate-in data-closed:animate-out data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-open:slide-in-from-bottom-10 fixed z-50 flex flex-col bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsx(
            Dialog.Close,
            {
              "data-slot": "sheet-close",
              render: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "absolute top-4 right-4", size: "icon-sm", children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ] })
            }
          )
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn$1("gap-1.5 p-6 flex flex-col", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Dialog.Title,
    {
      "data-slot": "sheet-title",
      className: cn$1("text-foreground text-base font-medium", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Dialog.Description,
    {
      "data-slot": "sheet-description",
      className: cn$1("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Tooltip$1.Provider,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(Tooltip$1.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(Tooltip$1.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(Tooltip$1.Portal, { children: /* @__PURE__ */ jsx(
    Tooltip$1.Positioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxs(
        Tooltip$1.Popup,
        {
          "data-slot": "tooltip-content",
          className: cn$1(
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-2xl px-3 py-1.5 text-xs **:data-[slot=kbd]:rounded-4xl bg-foreground text-background z-50 w-fit max-w-xs origin-(--transform-origin)",
            className
          ),
          ...props,
          children: [
            children,
            /* @__PURE__ */ jsx(Tooltip$1.Arrow, { className: "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground z-50 data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext, { value: contextValue, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn$1(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offExamples",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn$1(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn$1(
              "transition-[width] duration-200 ease-linear relative w-(--sidebar-width) bg-transparent",
              "group-data-[collapsible=offExamples]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            className: cn$1(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offExamples]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offExamples]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-sidebar group-data-[variant=floating]:ring-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 flex size-full flex-col",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon-sm",
      className: cn$1(className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeftIcon, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn$1(
        "bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 relative flex w-full flex-1 flex-col",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn$1("gap-2 p-2 flex flex-col", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn$1("gap-2 p-2 flex flex-col", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn$1(
        "no-scrollbar gap-2 flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn$1(
        "p-2 relative flex w-full min-w-0 flex-col",
        className
      ),
      ...props
    }
  );
}
function SidebarGroupLabel({
  className,
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps(
      {
        className: cn$1(
          "text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0",
          className
        )
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-group-label",
      sidebar: "group-label"
    }
  });
}
function SidebarGroupContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn$1("text-sm w-full", className),
      ...props
    }
  );
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn$1("gap-1 flex w-full min-w-0 flex-col", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn$1("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-lg p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-9 text-sm",
        sm: "h-8 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const { isMobile, state } = useSidebar();
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps(
      {
        className: cn$1(sidebarMenuButtonVariants({ variant, size }), className)
      },
      props
    ),
    render: !tooltip ? render : TooltipTrigger,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive
    }
  });
  if (!tooltip) {
    return comp;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    comp,
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
const menus = [
  {
    label: "Platform",
    children: [
      {
        label: "Dashboard",
        icon: /* @__PURE__ */ jsx(LayoutDashboard, {}),
        href: "/studio"
      }
    ]
  },
  {
    label: "Resource",
    children: [
      {
        label: "Posts",
        icon: /* @__PURE__ */ jsx(PencilLine, {}),
        href: "/studio/posts"
      },
      {
        label: "Projects",
        href: "/studio/projects",
        icon: /* @__PURE__ */ jsx(Folder, {})
      }
    ]
  }
];
function Avatar({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Avatar$1.Root,
    {
      "data-slot": "avatar",
      "data-size": size,
      className: cn$1(
        "size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Avatar$1.Image,
    {
      "data-slot": "avatar-image",
      className: cn$1(
        "rounded-full aspect-square size-full object-cover",
        className
      ),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Avatar$1.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn$1(
        "bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs",
        className
      ),
      ...props
    }
  );
}
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsx(Menu.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(Menu.Trigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(Menu.Portal, { children: /* @__PURE__ */ jsx(
    Menu.Positioner,
    {
      className: "isolate z-50 outline-none",
      align,
      alignOffset,
      side,
      sideOffset,
      children: /* @__PURE__ */ jsx(
        Menu.Popup,
        {
          "data-slot": "dropdown-menu-content",
          className: cn$1(
            "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 bg-popover text-popover-foreground min-w-48 rounded-2xl p-1 shadow-2xl ring-1 duration-100 dark z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden",
            className
          ),
          ...props
        }
      )
    }
  ) });
}
function DropdownMenuGroup({ ...props }) {
  return /* @__PURE__ */ jsx(Menu.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Menu.GroupLabel,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn$1("text-muted-foreground px-3 py-2.5 text-xs data-[inset]:pl-8", className),
      ...props
    }
  );
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Menu.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn$1(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2.5 rounded-xl px-3 py-2 text-sm [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Menu.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn$1("bg-border/50 -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function NavUser() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { data, isPending } = useSession();
  function handleLogout() {
    authClient.signOut();
    navigate({ to: "/studio/login" });
  }
  if (isPending) {
    return null;
  }
  return /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(
      DropdownMenuTrigger,
      {
        render: /* @__PURE__ */ jsxs(
          SidebarMenuButton,
          {
            size: "lg",
            className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
            children: [
              /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 rounded-lg ", children: [
                /* @__PURE__ */ jsx(AvatarImage, { src: data?.user.image || "", alt: data?.user.name }),
                /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: data?.user.name.slice(0, 2) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
                /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: data?.user.name }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground truncate text-xs", children: data?.user.email })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      DropdownMenuContent,
      {
        align: "end",
        className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
        side: isMobile ? "bottom" : "top",
        sideOffset: 4,
        children: /* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
          /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "p-0 font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 rounded-lg", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: data?.user.image || "", alt: data?.user.name }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: data?.user.name.slice(0, 2) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: data?.user.name }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground truncate text-xs", children: data?.user.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: handleLogout, children: "Log out" })
        ] })
      }
    )
  ] }) }) });
}
function AppSidebar() {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsxs(Sidebar, { variant: "inset", children: [
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(
      SidebarMenuButton,
      {
        size: "lg",
        render: /* @__PURE__ */ jsxs("a", { href: "#", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-primary/5  flex aspect-square size-8 items-center justify-center rounded-md", children: /* @__PURE__ */ jsx(CitrusIcon, { className: "size-5 text-primary" }) }),
          /* @__PURE__ */ jsx("div", { className: " flex-1 text-left font-bold text-sm leading-tight", children: "BLOG" })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx(SidebarContent, { children: menus.map((menuGroup) => {
      return /* @__PURE__ */ jsxs(SidebarGroup, { children: [
        /* @__PURE__ */ jsx(SidebarGroupLabel, { children: menuGroup.label }),
        /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: menuGroup.children.map((menu) => {
          return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
            SidebarMenuButton,
            {
              isActive: pathname === menu.href,
              render: /* @__PURE__ */ jsxs(Link, { to: menu.href, children: [
                menu.icon,
                menu.label
              ] })
            }
          ) }, menu.label);
        }) }) })
      ] }, menuGroup.label);
    }) }),
    /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsx(NavUser, {}) })
  ] });
}
function AppThemeToggle() {
  const { theme, setTheme } = useTheme();
  function toggleDarkMode() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "ghost",
      size: "icon",
      className: "size-7",
      onClick: toggleDarkMode,
      "data-style": "ghost",
      children: [
        /* @__PURE__ */ jsx(Moon, { className: "size-4 dark:inline hidden" }),
        /* @__PURE__ */ jsx(Sun, { className: "size-4 inline dark:hidden" })
      ]
    }
  );
}
function StudioShell({ children }) {
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("header", { className: "border-b p-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(AppThemeToggle, {}) })
      ] }),
      /* @__PURE__ */ jsx(ScrollArea, { className: "max-h-[calc(100vh-66px)] pb-2 px-2", children })
    ] })
  ] });
}
export {
  AdminContainer as A,
  MAX_FILE_SIZE as M,
  StudioShell as S,
  isNodeTypeSelected as a,
  isValidPosition as b,
  cn as c,
  isMarkInSchema as d,
  isExtensionAvailable as e,
  findNodePosition as f,
  focusNextNode as g,
  hono as h,
  isNodeInSchema as i,
  handleImageUpload as j,
  parseShortcutKeys as p,
  sanitizeUrl as s,
  useIsMobile as u
};
