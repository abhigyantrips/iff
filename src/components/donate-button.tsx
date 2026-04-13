import { Button } from '@/components/ui/button';

export function DonateButton() {
  return (
    <Button variant="default" className="text-sm" asChild>
      <a href="https://internetfreedom.in/donate">Donate</a>
    </Button>
  );
}
