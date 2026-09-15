import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import * as React from 'react';

import { SpotifyNodeView } from '../spotify-node/spotify-node';
import { parseSpotifyTrack } from '~/lib/spotify';
import './iframe-node.css';

export const IFrameNodeView: React.FC<NodeViewProps> = React.memo(
  (props) => {
    const { node } = props;
    const { code } = node.attrs;

    if (parseSpotifyTrack(code)) return <SpotifyNodeView {...props} />;

    return (
      <NodeViewWrapper className='iframe-node'>
        <div className='iframe-container' dangerouslySetInnerHTML={{ __html: code }} />
      </NodeViewWrapper>
    );
  },
  (prev, next) => prev.node.attrs.code === next.node.attrs.code,
);
