"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarBlankIcon,
  EnvelopeSimpleIcon,
  PaperPlaneTiltIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { generateMailtoLink } from "@/lib/mailto";

interface Recipient {
  name: string;
  email: string;
}

interface CampaignViewProps {
  title: string;
  description: string;
  date: string;
  emailTo: Recipient[];
  emailCc: Recipient[];
  emailBcc: Recipient[];
  rawContent: string;
  autoRedirect?: boolean;
}

function RecipientLinks({ recipients }: { recipients: Recipient[] }) {
  return (
    <span className="flex flex-wrap gap-x-1">
      {recipients.map((recipient, index) => (
        <span key={recipient.email}>
          <a
            href={`mailto:${recipient.email}`}
            className="text-primary hover:underline"
          >
            {recipient.name}
          </a>
          {index < recipients.length - 1 && <span>,</span>}
        </span>
      ))}
    </span>
  );
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
    .replace(/\n\n/gim, "</p><p>")
    .replace(/\n/gim, "<br>")
    .replace(/^(.+)$/gim, "<p>$1</p>")
    .replace(/<p><h/gim, "<h")
    .replace(/<\/h(\d)><\/p>/gim, "</h$1>")
    .replace(/<p><li>/gim, "<ul><li>")
    .replace(/<\/li><\/p>/gim, "</li></ul>")
    .replace(/<\/ul><ul>/gim, "");
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s*(.*$)/gim, "$1")
    .replace(/\*\*(.*?)\*\*/gim, "$1")
    .replace(/\*(.*?)\*/gim, "$1")
    .replace(/^\- /gim, "• ")
    .replace(/^\d+\.\s/gim, "")
    .trim();
}

export function CampaignView({
  title,
  description,
  date,
  emailTo,
  emailCc,
  emailBcc,
  rawContent,
  autoRedirect = false,
}: CampaignViewProps) {
  const htmlContent = useMemo(() => markdownToHtml(rawContent), [rawContent]);
  
  const plainTextContent = useMemo(() => markdownToPlainText(rawContent), [rawContent]);

  const mailtoLink = generateMailtoLink({
    to: emailTo,
    cc: emailCc,
    bcc: emailBcc,
    subject: title,
    body: plainTextContent,
  });

  useEffect(() => {
    if (autoRedirect) {
      window.location.href = mailtoLink;
    }
  }, [autoRedirect, mailtoLink]);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-4">
          <CalendarBlankIcon data-icon="inline-start" />
          {formattedDate}
        </Badge>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      </div>

      <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-card to-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UsersIcon className="size-5 text-primary" />
            Recipients
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">To:</span>
            <div className="mt-1 text-sm">
              <RecipientLinks recipients={emailTo} />
            </div>
          </div>
          {emailCc.length > 0 && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">CC:</span>
              <div className="mt-1 text-sm">
                <RecipientLinks recipients={emailCc} />
              </div>
            </div>
          )}
          {emailBcc.length > 0 && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">BCC:</span>
              <div className="mt-1 text-sm">
                <RecipientLinks recipients={emailBcc} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <EnvelopeSimpleIcon className="size-5 text-primary" />
            Email Content
          </CardTitle>
          <CardDescription>Preview of the email that will be sent</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-stone dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="flex flex-col items-center gap-4">
        <Button asChild size="lg" className="gap-2 px-8 text-lg">
          <a href={mailtoLink}>
            <PaperPlaneTiltIcon data-icon="inline-start" weight="fill" />
            Send Email
          </a>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Clicking this button will open your default email client with the message pre-filled.
        </p>
      </div>
    </div>
  );
}
