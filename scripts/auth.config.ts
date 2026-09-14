// The schema CLI runs in Node, outside the Worker request context.
import { getAuth } from '../src/lib/auth';

export const auth = getAuth();
