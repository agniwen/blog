import { domToReact, Element } from 'html-react-parser';
import type { DOMNode } from 'html-react-parser';
import { parseDocument } from 'htmlparser2';

import { SpotifyCard } from '~/components/features/spotify-card';
import { parseSpotifyTrack, spotifySnapshot } from '~/lib/spotify';

export function ArticleBody({ html }: { html: string }) {
  return (
    <>
      {domToReact(parseDocument(html).children as DOMNode[], {
        replace(node) {
          if (!(node instanceof Element)) return;
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
