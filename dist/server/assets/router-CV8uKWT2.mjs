import { createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider as QueryClientProvider$1 } from "@tanstack/react-query";
import { ThemeProvider as ThemeProvider$1 } from "next-themes";
import { T as TSS_SERVER_FUNCTION, f as getServerFnById, e as createServerFn } from "../server.mjs";
import z__default, { z } from "zod";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { a as auth, f as env } from "./auth-BaGll2Xr.mjs";
import { createFactory } from "hono/factory";
import { d as db, p as posts } from "./db-a0rvcoi6.mjs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const queryClient = new QueryClient();
function QueryClientProvider(props) {
  return /* @__PURE__ */ jsx(QueryClientProvider$1, { client: queryClient, children: props.children });
}
function ThemeProvider({
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(ThemeProvider$1, { ...props, children });
}
const appCss = "/assets/globals-o5Wojz6A.css";
const Route$c = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "akumanoko" },
      { name: "description", content: "akumanoko" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootDocument,
  component: RootOutlet
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { suppressHydrationWarning: true, lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootOutlet() {
  return /* @__PURE__ */ jsxs(
    ThemeProvider,
    {
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true,
      children: [
        /* @__PURE__ */ jsx(QueryClientProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
        /* @__PURE__ */ jsx(Toaster, { position: "top-center" })
      ]
    }
  );
}
const $$splitComponentImporter$8 = () => import("./route-CZg7Gvmc.mjs");
const Route$b = createFileRoute("/blog")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./index-DHQZ1ix0.mjs");
const Route$a = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "akumanoko"
    }, {
      name: "description",
      content: "akumanoko"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const createSsrRpc = (functionId, importer) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getSessionServerFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("d34b813c0f18d135c36bb2d9e67c184fdf92f0f8baa83e302195da0bfaaaa07b"));
async function requireAdmin() {
  const session = await getSessionServerFn();
  if (session?.user.role !== "admin") {
    throw redirect({ to: "/" });
  }
  return session;
}
async function redirectAdminToStudio() {
  const session = await getSessionServerFn();
  if (session?.user.role === "admin") {
    throw redirect({ to: "/studio" });
  }
}
const $$splitComponentImporter$6 = () => import("./index-B4cm17p5.mjs");
const Route$9 = createFileRoute("/studio/")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const getPublishedPostsServerFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("bb30a4188a05b4facb3163937ab48afc49025a8af1bf16b8b7fbafe07d39d1ed"));
const getPublishedPostServerFn = createServerFn({
  method: "GET"
}).inputValidator(z.object({
  id: z.string()
})).handler(createSsrRpc("11f6f2ea6dc0df5f8dca10bda1841334d6eaf9067b68c92f9e4104633e08aff5"));
const $$splitComponentImporter$5 = () => import("./index-BJcxvJca.mjs");
const Route$8 = createFileRoute("/blog/")({
  loader: async () => {
    const posts2 = await getPublishedPostsServerFn();
    return {
      posts: posts2
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./projects-BCXCxxL7.mjs");
const Route$7 = createFileRoute("/studio/projects")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./login-DkjWUEux.mjs");
const Route$6 = createFileRoute("/studio/login")({
  beforeLoad: async () => {
    await redirectAdminToStudio();
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const Route$5 = createFileRoute("/sitemap/xml")({
  server: {
    handlers: {
      GET: async () => {
        const base = "https://blog.baka.wiki";
        const posts2 = await getPublishedPostsServerFn();
        const urls = [
          "/",
          "/blog",
          ...posts2.map((post) => `/blog/${post.id}`)
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${base}${url}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8"
          }
        });
      }
    }
  }
});
const getCommentsServerFn = createServerFn({
  method: "GET"
}).inputValidator(z.object({
  postId: z.string()
})).handler(createSsrRpc("552b33777e12c1e63bf67a573af18ee971800506c1a4bd6a1a586b09541c55b0"));
const createCommentServerFn = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  postId: z.string(),
  content: z.string()
})).handler(createSsrRpc("4deedae7517058e5c3d7a96e9cc471958a98cbca0cf278ecb344624071b87c52"));
const $$splitComponentImporter$2 = () => import("./_id-NVAfvyt_.mjs");
const Route$4 = createFileRoute("/blog/$id")({
  loader: async ({
    params
  }) => {
    const [post, comments] = await Promise.all([getPublishedPostServerFn({
      data: {
        id: params.id
      }
    }), getCommentsServerFn({
      data: {
        postId: params.id
      }
    })]);
    return {
      post,
      comments
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: loaderData?.post?.title ?? "Blog"
    }, {
      name: "description",
      content: loaderData?.post?.description ?? ""
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const factory = createFactory();
const betterAuthMiddleware = factory.createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});
const drizzleMiddleware = factory.createMiddleware(async (c, next) => {
  c.set("db", db());
  return next();
});
function success(data, message) {
  return {
    code: 200,
    data,
    message
  };
}
function fail(message) {
  return {
    code: 500,
    data: null,
    message
  };
}
const s3 = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
});
const urlSchema = z.object({
  url: z.string().url("Invalid URL")
});
async function downloadAndUploadImage(imageUrl) {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BookmarkBot/1.0)"
      }
    });
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return void 0;
    }
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await response.arrayBuffer();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = contentType.split("/")[1] || "jpg";
    const key = `assets/bookmarks/images/${timestamp}-${randomString}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(imageBuffer),
      ContentType: contentType
    });
    await s3.send(command);
    return `${env.CLOUDFLARE_CDN_URL}/${key}`;
  } catch (error) {
    console.error("Error downloading and uploading image:", error);
    return void 0;
  }
}
async function fetchOGData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BookmarkBot/1.0)"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch URL");
    }
    const html = await response.text();
    const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)?.[1];
    const ogDescription = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i)?.[1];
    const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)?.[1];
    const ogSiteName = html.match(/<meta\s+property="og:site_name"\s+content="([^"]*)"/i)?.[1];
    const title = ogTitle || html.match(/<title>([^<]*)<\/title>/i)?.[1];
    const description = ogDescription || html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1];
    const favicon = html.match(/<link\s+rel="(?:icon|shortcut icon)"\s+href="([^"]*)"/i)?.[1];
    const baseUrl = new URL(url);
    const resolveUrl = (relativeUrl) => {
      if (!relativeUrl)
        return void 0;
      try {
        return new URL(relativeUrl, baseUrl).href;
      } catch {
        return relativeUrl;
      }
    };
    const resolvedImageUrl = resolveUrl(ogImage);
    let proxyImageUrl = resolvedImageUrl;
    if (resolvedImageUrl) {
      const uploadedUrl = await downloadAndUploadImage(resolvedImageUrl);
      if (uploadedUrl) {
        proxyImageUrl = uploadedUrl;
      }
    }
    const result = {
      title: title?.trim(),
      description: description?.trim(),
      image: proxyImageUrl,
      url,
      siteName: ogSiteName?.trim(),
      favicon: resolveUrl(favicon)
    };
    console.error("Fetched OG data:", { ogImage, resolvedImageUrl, proxyImageUrl, result });
    return result;
  } catch (error) {
    console.error("Error fetching OG data:", error);
    throw error;
  }
}
const bookmarkRouter = factory.createApp().post(
  "/fetch-og-data",
  zValidator("json", urlSchema),
  async (c) => {
    const { url } = c.req.valid("json");
    try {
      const ogData = await fetchOGData(url);
      return c.json(success(ogData));
    } catch (error) {
      console.error("Failed to fetch OG data:", error);
      return c.json(
        fail(error instanceof Error ? error.message : "Failed to fetch OG data"),
        500
      );
    }
  }
);
const authMiddleware = factory.createMiddleware(async (c, next) => {
  if (!c.var.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  return next();
});
const postsCreateSchema = z__default.object({
  title: z__default.string().optional(),
  description: z__default.string().optional(),
  slug: z__default.string().optional(),
  banner: z__default.url().optional(),
  summary: z__default.string().optional(),
  published: z__default.boolean().optional(),
  htmlContent: z__default.string().optional(),
  jsonContent: z__default.any().optional()
});
const postsUpdateSchema = postsCreateSchema.extend({
  id: z__default.string().min(1, "ID is required")
});
const postsDetailSchema = z__default.object({
  id: z__default.string().min(1, "ID is required")
});
const postsRouter = factory.createApp().get("/", async (c) => {
  const list = await c.var.db.query.posts.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return c.json(success(list));
}).post("/", authMiddleware, zValidator("json", postsCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const [res] = await c.var.db.insert(posts).values({
    ...data
  }).returning();
  return c.json(success(res));
}).put("/", authMiddleware, zValidator("json", postsUpdateSchema), async (c) => {
  const { id, ...rest } = c.req.valid("json");
  const [res] = await c.var.db.update(posts).set({
    ...rest
  }).where(eq(posts.id, id)).returning();
  return c.json(success(res));
}).get("/:id", zValidator("param", postsDetailSchema), async (c) => {
  const { id } = c.req.valid("param");
  const post = await c.var.db.query.posts.findFirst({
    where: {
      id,
      published: true
    }
  });
  return c.json(success(post));
}).delete("/:id", authMiddleware, zValidator("param", postsDetailSchema), async (c) => {
  const { id } = c.req.valid("param");
  const [deleted] = await c.var.db.delete(posts).where(eq(posts.id, id)).returning();
  return c.json(success(deleted));
});
const presignedUrlSchema = z.object({
  fileName: z.string().min(1, "文件名不能为空"),
  fileType: z.string().min(1, "文件类型不能为空")
});
const s3Router = factory.createApp().post(
  "/presigned-url",
  zValidator("json", presignedUrlSchema),
  async (c) => {
    const { fileName, fileType } = c.req.valid("json");
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const key = `assets/${fileType}/${timestamp}-${randomString}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType
    });
    try {
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
      return c.json({
        success: true,
        uploadUrl,
        key,
        // 假设你配置了公共访问，这是文件上传后的访问 URL
        fileUrl: `${env.CLOUDFLARE_CDN_URL}/${key}`
      });
    } catch (error) {
      console.error("生成预签名 URL 失败:", error);
      return c.json(
        {
          success: false,
          error: "生成上传链接失败"
        },
        500
      );
    }
  }
);
const app = new Hono().use(
  "/api/auth/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true
  })
).on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
}).use(drizzleMiddleware, betterAuthMiddleware).basePath("/api").route("/s3", s3Router).route("/posts", postsRouter).route("/bookmark", bookmarkRouter);
function handle({ request }) {
  return app.fetch(request);
}
const Route$3 = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
      OPTIONS: handle,
      HEAD: handle
    }
  }
});
const $$splitComponentImporter$1 = () => import("./index-DbE-66BE.mjs");
const Route$2 = createFileRoute("/studio/posts/")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const Route$1 = createFileRoute("/studio/posts/upsert/")({
  beforeLoad: async () => {
    await requireAdmin();
    throw redirect({ to: "/studio/posts" });
  }
});
const $$splitComponentImporter = () => import("./_id-B5zMDlSf.mjs");
const Route = createFileRoute("/studio/posts/upsert/$id")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const BlogRouteRoute = Route$b.update({
  id: "/blog",
  path: "/blog",
  getParentRoute: () => Route$c
});
const IndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$c
});
const StudioIndexRoute = Route$9.update({
  id: "/studio/",
  path: "/studio/",
  getParentRoute: () => Route$c
});
const BlogIndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => BlogRouteRoute
});
const StudioProjectsRoute = Route$7.update({
  id: "/studio/projects",
  path: "/studio/projects",
  getParentRoute: () => Route$c
});
const StudioLoginRoute = Route$6.update({
  id: "/studio/login",
  path: "/studio/login",
  getParentRoute: () => Route$c
});
const SitemapXmlRoute = Route$5.update({
  id: "/sitemap/xml",
  path: "/sitemap/xml",
  getParentRoute: () => Route$c
});
const BlogIdRoute = Route$4.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => BlogRouteRoute
});
const ApiSplatRoute = Route$3.update({
  id: "/api/$",
  path: "/api/$",
  getParentRoute: () => Route$c
});
const StudioPostsIndexRoute = Route$2.update({
  id: "/studio/posts/",
  path: "/studio/posts/",
  getParentRoute: () => Route$c
});
const StudioPostsUpsertIndexRoute = Route$1.update({
  id: "/studio/posts/upsert/",
  path: "/studio/posts/upsert/",
  getParentRoute: () => Route$c
});
const StudioPostsUpsertIdRoute = Route.update({
  id: "/studio/posts/upsert/$id",
  path: "/studio/posts/upsert/$id",
  getParentRoute: () => Route$c
});
const BlogRouteRouteChildren = {
  BlogIdRoute,
  BlogIndexRoute
};
const BlogRouteRouteWithChildren = BlogRouteRoute._addFileChildren(
  BlogRouteRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  BlogRouteRoute: BlogRouteRouteWithChildren,
  ApiSplatRoute,
  SitemapXmlRoute,
  StudioLoginRoute,
  StudioProjectsRoute,
  StudioIndexRoute,
  StudioPostsIndexRoute,
  StudioPostsUpsertIdRoute,
  StudioPostsUpsertIndexRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$8 as R,
  Route$4 as a,
  Route as b,
  createCommentServerFn as c,
  getCommentsServerFn as g,
  router as r
};
