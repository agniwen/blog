import { defineHandler } from 'void';

import { getAuth } from '~/lib/auth';
const handler = defineHandler((c) => getAuth().handler(c.req.raw));
export { handler as GET, handler as POST };
