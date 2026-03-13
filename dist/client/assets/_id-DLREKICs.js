import { r as f, c as C, g as I, a as k, j as e, t as p, L as g, b as N } from "./main-Cq61YlVT.js";
import { u as S } from "./useQuery-BG577FP4.js";
import { I as z, a as M, b as P, c as E } from "./bookmark-node-Jf11ngow.js";
import { S as A } from "./separator-DbLTj1dh.js";
import { a as h } from "./auth-client-BbRWIRUF.js";
import { c as y, B as j } from "./button-DCFLH-17.js";
import { d as w } from "./dayjs-DguT4X4p.js";
import { c as u } from "./utils-8lG47UID.js";
import { I as v } from "./iconify-VgZ200O7.js";
import { P as D } from "./page-container-CScIFj6H.js";
import { e as L } from "./index-UGsZvMoO.js";
import { r as Y } from "./resolve-elements-DE4kZt9S.js";
import "./element-CMmi1D3q.js";
import "./env-hDWImd5Y.js";
import "./is-ref-object-f5CSWQ4m.js";
const V = { some: 0, all: 1 };
function _(s, t, { root: n, margin: a, amount: r = "some" } = {}) {
  const o = Y(s),
    i = new WeakMap(),
    d = (m) => {
      m.forEach((l) => {
        const x = i.get(l.target);
        if (l.isIntersecting !== !!x)
          if (l.isIntersecting) {
            const b = t(l.target, l);
            typeof b == "function" ? i.set(l.target, b) : c.unobserve(l.target);
          } else typeof x == "function" && (x(l), i.delete(l.target));
      });
    },
    c = new IntersectionObserver(d, {
      root: n,
      rootMargin: a,
      threshold: typeof r == "number" ? r : V[r],
    });
  return (o.forEach((m) => c.observe(m)), () => c.disconnect());
}
function q(s, { root: t, margin: n, amount: a, once: r = !1, initial: o = !1 } = {}) {
  const [i, d] = f.useState(o);
  return (
    f.useEffect(() => {
      if (!s.current || (r && i)) return;
      const c = () => (d(!0), r ? void 0 : () => d(!1)),
        m = { root: (t && t.current) || void 0, margin: n, amount: a };
      return _(s.current, c, m);
    }, [t, s, n, r, a]),
    i
  );
}
const B = [
    ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
    ["path", { d: "M12 19V5", key: "x0mq9r" }],
  ],
  G = y("arrow-up", B);
const F = [
    ["path", { d: "M8 2v4", key: "1cmpym" }],
    ["path", { d: "M16 2v4", key: "4m81vk" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
    ["path", { d: "M3 10h18", key: "8toen8" }],
  ],
  H = y("calendar", F);
async function R(s) {
  return I({ data: { postId: s } });
}
async function Q(s) {
  return C({ data: s });
}
function K({ id: s }) {
  const { data: t } = h.useSession(),
    n = k(),
    [a, r] = f.useState(""),
    [o, i] = f.useState(!1);
  async function d(c) {
    (c.preventDefault(), i(!0));
    const m = a;
    if (a.trim().length === 0) {
      (p.info("请输入评论"), i(!1));
      return;
    }
    if (!t?.user) {
      (p.info("请登陆后评论"), r(""), i(!1));
      return;
    }
    const l = { postId: s, content: m };
    try {
      (await Q(l),
        p.success("评论成功"),
        r(""),
        n.invalidateQueries({ queryKey: ["comments", s] }));
    } catch (x) {
      (console.error(x), p.error("评论失败"));
    } finally {
      i(!1);
    }
  }
  return e.jsx("div", {
    className: "comment-input rounded-xl",
    children: e.jsx("div", {
      className: "pt-4 relative",
      children: e.jsx("form", {
        onSubmit: d,
        children: e.jsxs(z, {
          className: "[--radius:16px] pt-2",
          children: [
            e.jsx(M, {
              name: "comment",
              value: a,
              onChange: (c) => r(c.target.value),
              disabled: o,
              placeholder: "评论文章是免费的...",
            }),
            e.jsxs(P, {
              align: "block-end",
              children: [
                e.jsx(A, { className: "flex-1 bg-transparent", orientation: "vertical" }),
                e.jsx(E, {
                  type: "submit",
                  disabled: o,
                  variant: "default",
                  className: "rounded-full",
                  size: "icon-sm",
                  children: e.jsx(G, { className: "size-5" }),
                }),
              ],
            }),
          ],
        }),
      }),
    }),
  });
}
function O({ list: s }) {
  const { data: t } = h.useSession();
  return e.jsx("div", {
    className: u("comment-list w-full my-12!"),
    children: e.jsx("div", {
      children: s.map((n, a) => e.jsx(T, { user: t?.user, index: a, comment: n }, n.id)),
    }),
  });
}
function T({ comment: s, index: t, user: n }) {
  const a = s.userId === n?.id,
    r = w(s.createdAt);
  function o(i) {
    return i ? r.fromNow() : "-";
  }
  return e.jsxs("div", {
    className: u("comment-list-item gap-4 flex items-end mb-4! ", { "flex-row-reverse": a }),
    children: [
      e.jsx("div", {
        className: "shrink-0",
        children: e.jsx("img", {
          className: "rounded-full size-8",
          src: s.user?.image || "/default-avatar.svg",
          alt: "avatar",
        }),
      }),
      e.jsxs("div", {
        className: u({ "text-right": a }),
        children: [
          e.jsxs("div", {
            className: "pl-1 space-x-2 pb-1 ",
            children: [
              e.jsx("span", { className: "text-sm font-bold", children: s.user?.name }),
              e.jsxs("span", {
                className: "text-gray-500 text-[10px]",
                children: ["#", t + 1, " ", r?.format("YYYY-MM-DD HH:mm:ss")],
              }),
              e.jsx("span", { className: "text-gray-500 text-[10px]", children: o(s.createdAt) }),
            ],
          }),
          e.jsx("p", {
            className: u("inline-block text-left text-sm bg-gray-100 p-2", [
              a ? "rounded-t-xl rounded-bl-xl" : "rounded-t-xl rounded-br-xl",
            ]),
            children: s.content,
          }),
        ],
      }),
    ],
  });
}
function U({ children: s }) {
  const { data: t, isPending: n } = h.useSession();
  function a() {
    h.signIn.social({ provider: "github", callbackURL: location.href });
  }
  return t?.user || n
    ? s
    : e.jsxs("div", {
        className: " relative w-full  border border-gray-50 rounded-md p-2",
        children: [
          e.jsx("div", {
            className: "absolute z-10 top-0 left-0 h-full w-full bg-white/20 backdrop-blur-sm",
            children: e.jsx("div", {
              className: "h-full w-full flex justify-center items-center",
              children: e.jsxs("div", {
                children: [
                  e.jsxs("div", {
                    className: "text-sm text-center pb-4",
                    children: [
                      e.jsx("p", { className: "mb-2!", children: "使用社交账户登录评论" }),
                      e.jsxs("p", {
                        className: "text-xs",
                        children: [
                          "如果你没有以下社交帐户，你可以给我",
                          e.jsx("a", {
                            className: "text-black underline",
                            href: "mailto:wisakura@outlook.com",
                            children: "写信",
                          }),
                          "交流",
                        ],
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "flex p items-center justify-center gap-4",
                    children: e.jsxs(j, {
                      onClick: a,
                      children: [
                        e.jsx(v, {
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
          s,
        ],
      });
}
function W(s) {
  const { id: t, initialComments: n } = s,
    { data: a } = S({
      queryKey: ["comments", t],
      initialData: n,
      queryFn() {
        return R(t);
      },
    });
  return e.jsxs("div", {
    className: "comment w-full pb-24",
    children: [e.jsx(O, { list: a || [] }), e.jsx(U, { children: e.jsx(K, { id: t }) })],
  });
}
function $() {
  const s = f.useRef(null),
    t = q(s),
    n = L();
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx("div", {
        className: u(
          "fixed top-0 z-10 left-0  w-full bg-background/90 backdrop-blur-md transition-all ",
          t || !n ? "opacity-0 invisible " : "visible opacity-100 ",
        ),
        children: e.jsxs("div", {
          className: u(
            "mx-auto max-w-2xl flex relative items-center justify-between py-0.5 px-4   ",
          ),
          children: [
            e.jsx(g, {
              to: "/blog",
              className: "p-1 invisible md:visible",
              children: e.jsx(j, {
                size: "icon",
                className: "rounded-full",
                variant: "ghost",
                children: e.jsx(v, { className: "text-xl size-4", icon: "ri:arrow-left-line" }),
              }),
            }),
            e.jsx("span", {
              className: "text-sm font-bold",
              children: n ? document?.title.replace("- akumanoko", "") : "",
            }),
            e.jsx("span", { className: "size-6" }),
          ],
        }),
      }),
      e.jsx("div", {
        className: "mb-12",
        ref: s,
        children: e.jsx(g, {
          to: "/blog",
          children: e.jsx(j, {
            size: "icon",
            variant: "secondary",
            className: " rounded-full text-xl ",
            children: e.jsx(v, { icon: "ri:arrow-left-line" }),
          }),
        }),
      }),
    ],
  });
}
function J({ post: s }) {
  const t = s?.createdAt ? w(s.createdAt).format("YYYY年MM月DD日") : "-";
  return e.jsxs("div", {
    className: "post-content ",
    children: [
      s?.banner
        ? e.jsxs("div", {
            className: "mb-8  aspect-16/10  rounded-3xl relative pointer-events-none *:select-none",
            children: [
              e.jsx("img", {
                className: "object-cover aspect-16/10 rounded-3xl relative z-2",
                src: s.banner,
              }),
              e.jsx("img", {
                className:
                  "object-cover aspect-16/10 rounded-3xl absolute opacity-65 top-0  left-0 blur-xl z-1",
                src: s.banner,
              }),
            ],
          })
        : null,
      e.jsxs("div", {
        className: "mt-12 mb-8",
        children: [
          e.jsx("h1", { className: "mb-6 text-4xl font-bold", children: s?.title }),
          e.jsxs("p", {
            className: "flex items-center gap-8 opacity-80 text-sm",
            children: [
              e.jsxs("span", {
                className: "flex items-center gap-1",
                children: [e.jsx(H, { className: "size-4" }), "创建时间"],
              }),
              e.jsx("span", { children: t }),
            ],
          }),
        ],
      }),
      e.jsx("div", {
        children: e.jsx("div", {
          className: "tiptap ProseMirror",
          dangerouslySetInnerHTML: { __html: s?.htmlContent || "" },
        }),
      }),
    ],
  });
}
function xe() {
  const { id: s } = N.useParams(),
    { post: t, comments: n } = N.useLoaderData();
  return e.jsxs(D, {
    className: "pt-12 px-4 max-w-2xl mx-auto",
    children: [e.jsx($, {}), e.jsx(J, { post: t }), e.jsx(W, { id: s, initialComments: n })],
  });
}
export { xe as component };
