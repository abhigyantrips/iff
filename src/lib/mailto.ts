interface Recipient {
  name: string;
  email: string;
}

interface MailtoOptions {
  to: Recipient[];
  cc?: Recipient[];
  bcc?: Recipient[];
  subject: string;
  body: string;
}

export function generateMailtoLink(options: MailtoOptions): string {
  const { to, cc, bcc, subject, body } = options;

  const toEmails = to.map((r) => r.email).join(',');
  const params = new URLSearchParams();

  params.set('subject', subject);
  params.set('body', body);

  if (cc && cc.length > 0) {
    params.set('cc', cc.map((r) => r.email).join(','));
  }

  if (bcc && bcc.length > 0) {
    params.set('bcc', bcc.map((r) => r.email).join(','));
  }

  return `mailto:${toEmails}?${params.toString()}`;
}

export function formatRecipientsDisplay(recipients: Recipient[]): string {
  return recipients.map((r) => `${r.name} <${r.email}>`).join(', ');
}

export function formatRecipientAsLink(recipient: Recipient): {
  name: string;
  href: string;
} {
  return {
    name: recipient.name,
    href: `mailto:${recipient.email}`,
  };
}
