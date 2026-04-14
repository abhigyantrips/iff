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
  const params: string[] = [];

  params.push(`subject=${encodeURIComponent(subject)}`);
  params.push(`body=${encodeURIComponent(body)}`);

  if (cc && cc.length > 0) {
    params.push(`cc=${encodeURIComponent(cc.map((r) => r.email).join(','))}`);
  }

  if (bcc && bcc.length > 0) {
    params.push(`bcc=${encodeURIComponent(bcc.map((r) => r.email).join(','))}`);
  }

  return `mailto:${toEmails}?${params.join('&')}`;
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
