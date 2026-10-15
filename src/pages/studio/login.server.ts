import { defineHandler } from 'void';
export const loader = defineHandler((c) => {
  c.header('Cache-Control', 'private, no-store');
  return {};
});
