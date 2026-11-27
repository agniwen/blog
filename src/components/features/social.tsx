import {
  BilibiliIcon,
  GithubIcon,
  MailIcon,
  RssIcon,
  XIcon,
} from '~/components/features/brand-icons';
import { cn } from '~/lib/utils';

const socials = [
  { name: 'Twitter', url: 'https://x.com/agniwen', Icon: XIcon },
  { name: 'github', url: 'https://github.com/agniwen', Icon: GithubIcon },
  { name: 'bilibili', url: 'https://space.bilibili.com/2940875', Icon: BilibiliIcon },
  { name: 'email', url: 'mailto:wisakura@outlook.com', Icon: MailIcon },
  { name: 'RSS', url: '/rss.xml', Icon: RssIcon },
] as const;

export function Social({ className }: { className?: string }) {
  return (
    <div className={cn('-ml-1.5 flex h-8 items-center gap-1.5', className)}>
      {socials.map((social) => (
        <a
          key={social.url}
          href={social.url}
          target={social.url.startsWith('mailto:') ? undefined : '_blank'}
          rel={social.url.startsWith('mailto:') ? undefined : 'noreferrer'}
          aria-label={social.name}
          className='inline-flex size-8 items-center justify-center rounded-md text-foreground/72 transition-colors outline-none hover:bg-accent/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring'
        >
          <social.Icon className='size-5' />
        </a>
      ))}
    </div>
  );
}
