import type { HTMLAttributes } from 'react';

import googleIcon from '~/assets/icons/logos-google-icon.svg?raw';
import bilibiliIcon from '~/assets/icons/ri-bilibili-line.svg?raw';
import githubIcon from '~/assets/icons/ri-github-line.svg?raw';
import mailIcon from '~/assets/icons/ri-mail-line.svg?raw';
import rssIcon from '~/assets/icons/ri-rss-line.svg?raw';
import xIcon from '~/assets/icons/ri-twitter-x-line.svg?raw';
import { cn } from '~/lib/utils';

type IconProps = HTMLAttributes<HTMLSpanElement>;

function InlineSvg({ raw, className, ...props }: IconProps & { raw: string }) {
  const html = raw
    .replace(/\s(?:width|height)="[^"]*"/g, '')
    .replace('<svg ', '<svg class="size-full" focusable="false" aria-hidden="true" ');

  return (
    <span
      {...props}
      aria-hidden='true'
      className={cn('inline-flex', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function XIcon(props: IconProps) {
  return <InlineSvg raw={xIcon} {...props} />;
}

export function GithubIcon(props: IconProps) {
  return <InlineSvg raw={githubIcon} {...props} />;
}

export function BilibiliIcon(props: IconProps) {
  return <InlineSvg raw={bilibiliIcon} {...props} />;
}

export function MailIcon(props: IconProps) {
  return <InlineSvg raw={mailIcon} {...props} />;
}

export function RssIcon(props: IconProps) {
  return <InlineSvg raw={rssIcon} {...props} />;
}

export function GoogleIcon(props: IconProps) {
  return <InlineSvg raw={googleIcon} {...props} />;
}
