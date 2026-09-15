# Visual tokens

Reference: [Yohaku's open design system](https://github.com/Innei/Yohaku/tree/main/design-system), especially `src/tokens.css` and `CHEATSHEET.md`.

Scope: adapt colors, corner radii, borders and restrained shadows. Preserve the blog's existing layout, content order, copy, typography sizes and spacing. Do not add navigation, archive grouping, homepage feeds, or move the article cover/header without an explicit request.

The existing shadcn semantic tokens in `src/styles/app.css` map to Yohaku's palette: studio content `#fefefb`, public paper `#f9f8f5`, surfaces `#f9f8f5` / `#f0efeb`, text `#24231f` / `#5c5a55`, and the static contract's ume accent `#c56473` for focus. The accent remains separate from neutral hover fills. Dark surfaces use warm night `#1c1c1e` and neutral gray, with pink focus `#f596aa`.

Use 6px corners for buttons, 8px for cards, 12px for dialogs and a 16px cap for large media. Keep circular avatars. Borders use a 10% neutral ink alpha; shadows are low-opacity and soft. No heavy avatar drop shadow.

Do not introduce document-wide font/background resets from editor stylesheets. All routes and layouts continue to use TanStack Router's flat file conventions.

Keep the original frosted/noise background, including its 5% light-mode opacity and 2% dark-mode opacity. Content links use a darker ume `#a6495b` in light mode for readability; comment surfaces and selection colors follow the semantic theme.

Primary buttons and sidebar primary controls use ume `#c56473` in light mode and pink `#f596aa` in dark mode, paired with dark ink labels. Hover uses 90% opacity; link buttons use the accessible content-link shade.

Form controls (Input, Textarea, Select, NativeSelect, Combobox, InputGroup and OTP groups) use the same `rounded-xl` corner token (12px). Avoid pill-shaped `rounded-full` / `rounded-4xl` for form fields; matching field skeletons use the same radius.

Studio contains Posts only; `/studio` redirects to the article list and `/studio/projects` is removed. The shared shell owns the fixed sidebar/header and scrollable content boundary. `AdminContainer` provides 16px / 24px responsive padding for list pages, while `flush` allows the full-height editor to align with the same shell. Article cards use an auto-fill grid based on content width instead of switching to fixed-width flex items on wide screens.

Typography uses MiSans from jsDelivr (`misans@4.1.0`, Chinese subsets, Regular/Medium). Font binaries stay on the CDN and use `font-display: swap`. MiSans is created by Xiaomi; see https://hyperos.mi.com/font/ and its font license. The CDN declares weights 330/380 for normal/medium. UI emphasis never exceeds 500; use `font-medium` rather than semibold/bold, and cap rendered rich-text emphasis at 500. Original Noto Sans CJK, Inter, DM Sans and JetBrains font imports are removed.

## Loading states

Use the shared Skeleton primitive and neutral accent fill, with reduced-motion support. Route pending components mirror the actual blog list, article, login form, and editor containers. Static home content does not need a skeleton. TanStack Router waits 300 ms before showing route skeletons and keeps an activated skeleton visible for at least 300 ms; client query placeholders use the same constants via `useDelayedPending`. Keep cached content visible during background refetches. Timing regression checks run with `bun run test:loading`.

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

Local adaptations: button radius 6px and original control heights, input/textarea/select radius 12px, text weight no heavier than 500, subtle ghost hover using `accent/50`, and reduced-motion skeletons. Additional coss info/success/warning tokens use muted blue/green/ochre matching the existing chart palette; destructive text uses the existing destructive token.

Article and editor typography share the Typeset rhythm (https://ui.shadcn.com/typeset): 90ch preset (42em at a 15px base, or 630px) content measure, 15px desktop body, 16.875px below 768px, 1.75 line height, and 1.25em paragraph flow. Shared tokens and `.article-container` live in `src/styles/app.css`; both surfaces use the same Tiptap node styles. Keep MiSans and cap heading/emphasis weight at 500. The article list, reader, sticky article header, and their skeletons use `.article-container` for the same maximum width and gutters; avoid adding a second horizontal padding inside the list.

Use `cursor-default` for clickable controls and upload targets; `<a href>` links, including linked cards and buttons rendered as links, keep `cursor-pointer`. Keep text-editing, dragging, and resize cursors where they communicate the actual operation. Non-link interactive elements receive the default arrow through the global base layer.

Spotify embeds use the actual `@spell/spotify-card` registry source in `src/components/spotify-card.tsx` (https://spell.sh/docs/spotify-card), shared by the reader and Tiptap node. Preserve its cover slide, spinning record SVG and blurred artwork; local changes integrate query/snapshot loading, semantic theme colors, max-500 text weight, default button cursors, delayed skeletons, accessible playback errors and per-instance SVG IDs. Legacy Spotify iframe nodes also render through this component. The editor Spotify tool accepts track links, URIs and embed code, with preview, insertion, replacement and deletion.
