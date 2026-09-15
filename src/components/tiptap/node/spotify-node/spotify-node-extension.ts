import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin } from '@tiptap/pm/state';

import type { SpotifyData } from '~/lib/spotify';
import { parseSpotifyTrack, spotifySnapshot } from '~/lib/spotify';

import { SpotifyNodeView } from './spotify-node';

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    spotify: { setSpotify: (attributes: { url: string; metadata?: SpotifyData }) => ReturnType };
  }
}

export const SpotifyNode = Node.create({
  name: 'spotify',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return { metadata: { default: null, parseHTML: (element) => { try { return JSON.parse(element.getAttribute('data-spotify') ?? 'null'); } catch { return null; } } }, url: { default: '', parseHTML: (element) => parseSpotifyTrack(element.getAttribute('data-url') ?? element.getAttribute('src') ?? '') } };
  },
  parseHTML() {
    return [
      { tag: 'div[data-type="spotify"]', getAttrs: (element) => parseSpotifyTrack(element.getAttribute('data-url') ?? '') ? null : false },
      { tag: 'iframe[src]', getAttrs: (element) => { const url = parseSpotifyTrack(element.getAttribute('src') ?? ''); return url ? { url } : false; } },
    ];
  },
  renderHTML({ node }) {
    const url = parseSpotifyTrack(node.attrs.url) ?? '';
    return ['div', { 'data-type': 'spotify', 'data-url': url, 'data-spotify': JSON.stringify(spotifySnapshot(node.attrs.metadata, url) ?? null), class: 'spotify-node' }, ['a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, '在 Spotify 中打开']];
  },
  addNodeView() { return ReactNodeViewRenderer(SpotifyNodeView); },
  addCommands() {
    return { setSpotify: ({ url, metadata }) => ({ commands }) => {
      const normalized = parseSpotifyTrack(url);
      return normalized ? commands.insertContent({ type: this.name, attrs: { url: normalized, metadata: spotifySnapshot(metadata, normalized) ?? null } }) : false;
    } };
  },
  addProseMirrorPlugins() {
    return [new Plugin({ props: { handlePaste: (view, event) => {
      // Only replace a whole pasted track link; leave prose containing links alone.
      const url = parseSpotifyTrack(event.clipboardData?.getData('text/plain') ?? '');
      if (!url) return false;
      view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.spotify.create({ url })).scrollIntoView());
      return true;
    } } })];
  },
});
