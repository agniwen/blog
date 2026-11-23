import { type RefObject, useCallback, useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface LightboxImage {
  src: string;
  alt: string;
}

/**
 * 为已渲染的文章正文容器附加交互增强（目录提取、代码块复制按钮、正文图片灯箱），
 * 保持 `ArticleBody` 本身为无 Hook 纯函数以便 SSR 与单测稳定运行。
 */
export function useArticleEnhancements(
  containerRef: RefObject<HTMLElement | null>,
  html: string | null | undefined,
) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !html) {
      setTocItems([]);
      setActiveId(null);
      return;
    }

    // 1. 提取 H2 / H3 目录并分配稳定 ID
    const headings = Array.from(root.querySelectorAll('h2, h3'));
    const nextToc: TocItem[] = [];
    headings.forEach((heading, index) => {
      const text = heading.textContent?.trim();
      if (!text) return;
      const id = heading.id || `article-heading-${index}`;
      heading.id = id;
      heading.classList.add('scroll-mt-20');
      nextToc.push({
        id,
        text,
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });
    setTocItems(nextToc);
    setActiveId(nextToc[0]?.id ?? null);

    let headingObserver: IntersectionObserver | null = null;
    if (nextToc.length > 0) {
      headingObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]?.target.id) {
            setActiveId(visible[0].target.id);
          }
        },
        { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
      );
      headings.forEach((el) => headingObserver?.observe(el));
    }

    // 2. 为代码块注入复制按钮
    const cleanups: Array<() => void> = [];
    const preElements = Array.from(root.querySelectorAll('pre'));
    preElements.forEach((pre) => {
      pre.classList.add('relative', 'group/code');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '复制';
      button.setAttribute('aria-label', '复制代码');
      button.className =
        'absolute top-2 right-2 rounded-md border border-border bg-popover/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity duration-150 hover:text-foreground group-hover/code:opacity-100 focus-visible:opacity-100';

      let resetTimer: ReturnType<typeof setTimeout> | null = null;
      const handleCopy = async () => {
        const codeText = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
        try {
          await navigator.clipboard.writeText(codeText);
          button.textContent = '已复制';
          if (resetTimer) clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            button.textContent = '复制';
          }, 1500);
        } catch {
          button.textContent = '失败';
        }
      };

      button.addEventListener('click', handleCopy);
      pre.appendChild(button);
      cleanups.push(() => {
        if (resetTimer) clearTimeout(resetTimer);
        button.removeEventListener('click', handleCopy);
        button.remove();
      });
    });

    // 3. 正文图片点击灯箱（排除带外链的 <a> 包裹图片）
    const handleImageClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains('paper-image')) return;
      if (target.closest('a')) return;
      const src = target.currentSrc || target.src;
      if (!src) return;
      setLightboxImage({ src, alt: target.alt || '' });
    };
    root.addEventListener('click', handleImageClick);

    return () => {
      headingObserver?.disconnect();
      cleanups.forEach((fn) => fn());
      root.removeEventListener('click', handleImageClick);
    };
  }, [containerRef, html]);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  return { tocItems, activeId, lightboxImage, closeLightbox };
}
