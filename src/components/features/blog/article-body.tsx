import { attributesToProps, domToReact, Element } from 'html-react-parser';
import type { DOMNode } from 'html-react-parser';
import { parseDocument } from 'htmlparser2';

import { PaperImage } from '~/components/features/blog/paper-image';
import { SpotifyCard } from '~/components/features/spotify-card';
import { parseSpotifyTrack, spotifySnapshot } from '~/lib/spotify';

function isInlineIcon(node: Element): boolean {
  if (node.attribs.class?.split(/\s+/).includes('bookmark-favicon')) return true;
  let ancestor: Element | null = node;
  while (ancestor instanceof Element) {
    if (ancestor.attribs['data-type'] === 'emoji') return true;
    ancestor = ancestor.parent instanceof Element ? ancestor.parent : null;
  }
  return false;
}

export function ArticleBody({ html, imageSeed = '' }: { html: string; imageSeed?: string }) {
  let imageIndex = 0;
  return (
    <>
      {domToReact(parseDocument(html).children as DOMNode[], {
        replace(node) {
          if (!(node instanceof Element)) return;
          if (node.name === 'img' && !isInlineIcon(node)) {
            return (
              <PaperImage
                {...attributesToProps(node.attribs, 'img')}
                seed={`${imageSeed}:image:${imageIndex++}:${node.attribs.src ?? ''}`}
              />
            );
          }
          const type = node.attribs['data-type'];
          let input: string | undefined;
          if (type === 'spotify') input = node.attribs['data-url'];
          else if (type === 'iframe') input = node.attribs['data-code'];
          else if (node.name === 'iframe') input = node.attribs.src;
          const url = input ? parseSpotifyTrack(input) : null;
          if (url) {
            let metadata;
            try {
              metadata = spotifySnapshot(JSON.parse(node.attribs['data-spotify'] ?? 'null'), url);
            } catch {
              /* Old embeds have no snapshot. */
            }
            return <SpotifyCard key={url} url={url} metadata={metadata} />;
          }
        },
      })}
    </>
  );
}
