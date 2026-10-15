import { AdminContainer } from '~/components/features/studio/admin-container';
import { UpsertEditor } from '~/components/features/studio/upsert-editor';

import type { Props } from './[id].server';
export default function EditPost({ post }: Props) {
  return (
    <AdminContainer flush className='h-full'>
      <UpsertEditor key={post.id} post={post} />
    </AdminContainer>
  );
}
