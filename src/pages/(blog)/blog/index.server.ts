import { defineHandler, type InferProps } from 'void';

import { listPublishedPosts } from '~/routes/api/posts/_data';
export const loader = defineHandler(async () => ({ posts: await listPublishedPosts() }));
export type Props = InferProps<typeof loader>;
