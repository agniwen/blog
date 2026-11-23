import { countArticleWords } from '~/lib/article-utils';
import { success } from '~/lib/result';
import { factory } from '~/server/factory';
import { authMiddleware } from '~/server/middleware/auth';

export const dashboardRouter = factory.createApp().get('/', authMiddleware, async (c) => {
  const [allPosts, allTags, allComments, allUsers] = await Promise.all([
    c.var.db.query.posts.findMany({
      columns: {
        id: true,
        title: true,
        published: true,
        textContent: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    c.var.db.query.tags.findMany({ columns: { id: true } }),
    c.var.db.query.comments.findMany({
      columns: { id: true, content: true, createdAt: true, postId: true },
      orderBy: { createdAt: 'desc' },
      with: {
        user: { columns: { id: true, name: true, image: true } },
        post: { columns: { id: true, title: true } },
      },
    }),
    c.var.db.query.users.findMany({ columns: { id: true } }),
  ]);

  let publishedPosts = 0;
  let draftPosts = 0;
  let totalWords = 0;
  for (const post of allPosts) {
    if (post.published) publishedPosts++;
    else draftPosts++;
    if (post.textContent) {
      totalWords += countArticleWords(post.textContent);
    }
  }

  return c.json(
    success({
      counts: {
        totalPosts: allPosts.length,
        publishedPosts,
        draftPosts,
        totalTags: allTags.length,
        totalComments: allComments.length,
        totalUsers: allUsers.length,
        totalWords,
      },
      recentPosts: allPosts.slice(0, 5).map(({ textContent: _text, ...rest }) => rest),
      recentComments: allComments.slice(0, 5),
    }),
  );
});
