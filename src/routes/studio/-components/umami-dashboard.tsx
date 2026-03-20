import { buttonVariants } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { env } from '~/lib/env';
import { cn } from '~/lib/utils';

const umamiShareUrl = env.NEXT_PUBLIC_UMAMI_SHARE_URL;

function getUmamiEmbedState(url: string) {
  try {
    const hostname = new URL(url).hostname;

    if (hostname === 'cloud.umami.is') {
      return {
        canEmbed: false,
        reason:
          'Umami Cloud now sends X-Frame-Options: SAMEORIGIN, so it can no longer be embedded in an iframe.',
      };
    }

    return { canEmbed: true, reason: null };
  } catch {
    return {
      canEmbed: false,
      reason: 'The Umami share URL is invalid.',
    };
  }
}

export function UmamiDashboard() {
  const { canEmbed, reason } = getUmamiEmbedState(umamiShareUrl);

  if (!canEmbed) {
    return (
      <Card className='mx-auto mt-8 max-w-3xl'>
        <CardHeader>
          <CardTitle>Umami Dashboard</CardTitle>
          <CardDescription>{reason}</CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground'>
          Open the shared dashboard in a new tab to view analytics.
        </CardContent>
        <CardFooter>
          <a
            href={umamiShareUrl}
            target='_blank'
            rel='noreferrer'
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Open Umami
          </a>
        </CardFooter>
      </Card>
    );
  }

  return (
    <iframe
      title='Umami Dashboard'
      src={umamiShareUrl}
      sandbox='allow-scripts allow-popups allow-forms'
      referrerPolicy='strict-origin-when-cross-origin'
      className='h-[calc(100vh-4rem)] w-full rounded-md'
    />
  );
}
