# Visual tokens

Color reference: [Amp's signed-in application](https://ampcode.com/), inspected in Chrome and matched to its app CSS on 2026-09-15. Do not use the marketing homepage's blue/orange primary colors. Existing geometry and paper surfaces remain local.

Scope: adapt colors, corner radii, borders and restrained shadows. The homepage renders a centered profile header above a compact (`max-w-[30rem]`) editorial article list with baseline-aligned titles and dates. The header is one region: the slogan sits close to the social row. The article list is the next region. Preserve existing layout, content order, copy, typography sizes and spacing elsewhere. Do not add navigation, archive grouping, or move the article cover/header without an explicit request.

Keep the original paper surfaces: light background/popover `#fefefb`, public paper/sidebar/cards `#f9f8f5`; dark background `#1c1c1e` and surfaces `#262626`. Borders retain their original 10% neutral ink/white alpha. Ink is cool blue-black `#10202c` / sky-tinted text `#e7f3fb`. Light primary buttons use the pale sky wash `#d7e6f2` with navy labels `#1c3a52`. Dark primary is `#8ec8e8` with `#0c2434`. Light secondary is `#f1f2ef`, a neutral step darker than the ghost hover wash. Dark secondary is `#243848`. Muted text is `#595959` / `#9aafc0`, and subtle neutral hover fills. Links use blue `#286bbd` / `#6ca0e0`; focus rings use foreground. Preserve the noise texture and layout.

Use 6px corners for buttons, 8px for cards, 12px for dialogs and a 16px cap for large media. Keep circular avatars. Borders use a 10% neutral ink alpha; shadows are low-opacity and soft. No heavy avatar drop shadow.

The homepage avatar is a plain 72px (`size-18`) circle with a 1px edge and a restrained shadow. The article navbar uses the same circular `.home-avatar` at `size-6`. Other avatars retain their existing circles.

The article banner ships as an HTML image. When the browser is still loading it at hydration and supports canvas animation, a skeleton holds the space until the photograph can bloom from the paper color. The blurred backdrop is the same banner, shifted down and softened. It fades in once the photograph has arrived. Already loaded images and reduced-motion readers get the static image immediately. Sharing still uses the complete banner image. Body images and banners use `PaperImage` with a seeded SVG alpha mask for shallow, irregular paper edges on all sides. The banner canvas uses that same mask. Use low-frequency, low-amplitude grain and subpixel softness to avoid a harsh, chewed edge. The seed includes article identity and image position/source, so even repeated images have different contours while SSR, hydration and rerenders stay deterministic. Keep grain in CSS pixels with no SVG viewBox; displace only the mask, never the photograph. Preserve existing dimensions, cropping, links, rich-text image attributes and the banner's blurred backdrop. Emoji and bookmark favicons remain UI icons; editor images and Spotify artwork retain their own styling.

Homepage social links use one Remix Icon line set (X, GitHub, Bilibili, mail, RSS) at the same 20px size inside equal 32px hit targets. Google sign-in uses the colored SVG Logos mark. Comment publish actions may still opt into `shape='paper'`. The paper surface has irregular edges on all four sides, about 1–2px deep, and a faint shadow. Give the short sides comparable notch density and depth to the top and bottom so the paper effect is visible around the whole control. Keep the existing colors, dimensions and typography. Clip only the decorative surface so keyboard focus rings and touch targets stay intact. Studio controls (including `/studio/login`), editor tools and media artwork controls keep their existing geometry.

Icon-sized and `xs`/`sm` paper buttons use a quieter contour: mix longer near-straight stretches with occasional shallow tears at uneven intervals and depths. Mirror the decorative surface across neighboring compact buttons for variation; keep the content itself upright. Avoid evenly spaced teeth or identical repeated silhouettes.

The article page uses a fixed-top transparent navbar (`.article-sticky-header`) initially aligned to `.article-container`. The left control links back to `/` with the blog's circular avatar (`.home-avatar size-6`) and the current article title (`text-sm font-medium`); the homepage avatar and navbar avatar share `view-transition-name: blog-avatar` so route transitions morph smoothly between them. Navigating from the homepage reuses the cached post summary (`['post-list']`) so the avatar, title, banner and date render immediately without a loading skeleton. The right side displays a menu icon trigger (`MenuIcon`, `size-4.5`) when authenticated, opening a `MenuPopup` with a sign-out action. Both controls have no background by default and a very low-opacity hover fill (`hover:bg-foreground/[0.045]`). When scrolled past the top anchor, desktop (`md:`) glides the left and right controls outward to the viewport edges so they stay clear of the reading column, while mobile (`max-md:`) gives the controls a translucent popover background (`bg-popover/75 backdrop-blur-md`).

Do not introduce document-wide font/background resets from editor stylesheets. Routes and layouts use TanStack Router flat route conventions in `src/routes`.

Keep the original frosted/noise background, including its 5% light-mode opacity and 2% dark-mode opacity. Content links use the theme-specific blue tokens; comment surfaces and selection colors follow the semantic theme.

Primary buttons (the `default` variant), including Google sign-in and comment publish, use the pale sky wash in light mode (`#d7e6f2` / `#1c3a52`) and `#8ec8e8` / `#0c2434` in dark mode. Sidebar primary controls share that fill. Links use the separate readable blue token.

Form controls (Input, Textarea, Select, NativeSelect, Combobox, InputGroup and OTP groups) use the same `rounded-lg` corner token (8px). Avoid pill-shaped `rounded-full` / `rounded-4xl` for form fields; matching field skeletons use the same radius.

Studio contains Posts only; `/studio` redirects to the article list and `/studio/projects` is removed. The shared shell owns the fixed sidebar/header and scrollable content boundary. `AdminContainer` provides 16px / 24px responsive padding for list pages, while `flush` allows the full-height editor to align with the same shell. Article cards use an auto-fill grid based on content width instead of switching to fixed-width flex items on wide screens.

Typography uses MiSans from jsDelivr (`misans@4.1.0`, Chinese subsets, Regular/Medium). Font binaries stay on the CDN and use `font-display: swap`. MiSans is created by Xiaomi; see https://hyperos.mi.com/font/ and its font license. The CDN declares weights 330/380 for normal/medium. UI emphasis never exceeds 500; use `font-medium` rather than semibold/bold, and cap rendered rich-text emphasis at 500. Original Noto Sans CJK, Inter, DM Sans and JetBrains font imports are removed.

## Loading states

Use the shared Skeleton primitive and neutral accent fill, with reduced-motion support. The first homepage document paints the header immediately and holds a list skeleton until posts stream in. A direct article waits for the post so missing URLs stay real 404s. Comments load in parallel and stream into the page once ready. Route transitions use TanStack Router `pendingComponent` with a shared 300 ms delay and 300 ms minimum, and client widgets share that timing through `useDelayedPending`. Keep existing content visible during background refetches. Timing regression checks run with `bun run test:loading`.

## coss UI components

Shared UI uses the official coss registry (`https://coss.com/ui/r/{name}.json`), configured as `@coss` in `components.json`. Add individual components with `bunx shadcn@latest add @coss/<name>`. Do not install the coss style/font preset: MiSans CDN, paper texture, light/dark palettes, selection color and existing layout remain project-owned.

All previously present coss equivalents have been replaced, including Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox, Collapsible, Combobox, Command, ContextMenu, Dialog, Drawer, Empty, Field, Input, InputGroup, Kbd, Label, Pagination, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Sheet, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, ToggleGroup and Tooltip. Autocomplete and Fieldset support their composition.

| Previous component                     | coss replacement                                                     |
| -------------------------------------- | -------------------------------------------------------------------- |
| dropdown-menu                          | menu (`MenuPopup`, `MenuGroupLabel`)                                 |
| hover-card                             | preview-card                                                         |
| button-group                           | group                                                                |
| input-otp                              | otp-field                                                            |
| sonner                                 | toast (`ToastProvider`, `toastManager.add`)                          |
| native-select in the editor            | select (`SelectTrigger`, `SelectValue`, `SelectPopup`, `SelectItem`) |
| FieldSet / FieldGroup / FieldSeparator | Fieldset / layout div / Separator                                    |

AspectRatio, Carousel, Item, Menubar, NavigationMenu, Resizable and Sidebar have no direct coss counterpart and remain local components; Menubar composes the coss Menu. Background, PageContainer and TimeDisplay remain project-specific. Tiptap's editor primitives retain their editor-specific behavior and theme variables.

Use `render={<Link ... />}` for link buttons, without nested interactive elements. Async actions pass explicit `loading` to Button; the shared button no longer detects promises or manages mutations. Use coss `Popup` / `Panel` names in application code, Base UI `render` composition, and `onValueChange` for Select. Keep loading indicators at the existing 300ms delay / 300ms minimum.

Local adaptations: button radius 6px and original control heights, input/textarea/select radius 8px, text weight no heavier than 500, subtle ghost hover using `accent/50`, and reduced-motion skeletons. Additional coss info/success/warning tokens use muted blue/green/ochre matching the existing chart palette; destructive text uses the existing destructive token.

Article and editor typography share the Typeset rhythm (https://ui.shadcn.com/typeset): 90ch preset (42em at a 15px base, or 630px) content measure, 15px desktop body, 16.875px below 768px, 1.75 line height, and 1.25em paragraph flow. Shared tokens and `.article-container` live in `src/styles/app.css`; both surfaces use the same Tiptap node styles. Keep MiSans and cap heading/emphasis weight at 500. The article reader, sticky article header, editor, and their skeletons use `.article-container` for the same maximum width and gutters, while the homepage uses a compact centered `max-w-[30rem]` container for the profile header and article list.

Use `cursor-default` for clickable controls and upload targets; `<a href>` links, including linked cards and buttons rendered as links, keep `cursor-pointer`. Keep text-editing, dragging, and resize cursors where they communicate the actual operation. Non-link interactive elements receive the default arrow through the global base layer.

Spotify embeds use the actual `@spell/spotify-card` registry source in `src/components/features/spotify-card.tsx` (https://spell.sh/docs/spotify-card), shared by the reader and Tiptap node. Preserve its cover slide, spinning record SVG and blurred artwork; local changes integrate query/snapshot loading, semantic theme colors, max-500 text weight, default button cursors, delayed skeletons, accessible playback errors and per-instance SVG IDs. Legacy Spotify iframe nodes also render through this component. The editor Spotify tool accepts track links, URIs and embed code, with preview, insertion, replacement and deletion.

Input, Textarea, Select, InputGroup and Combobox focus rings use a thin 1px ring with the existing translucent ring color and a 40%-opacity focus border; avoid restoring the coss default 3px halo.
