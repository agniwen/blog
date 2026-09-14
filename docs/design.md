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
