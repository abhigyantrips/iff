"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EnvelopeSimpleIcon,
  PaperPlaneTiltIcon,
  UsersIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { generateMailtoLink } from "@/lib/mailto";

interface Recipient {
  name: string;
  email: string;
}

interface CampaignViewProps {
  title: string;
  description: string;
  lastDate?: string;
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
  const lines = markdown.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    line = line
      .replace(/^### (.*$)/i, "<h3>$1</h3>")
      .replace(/^## (.*$)/i, "<h2>$1</h2>")
      .replace(/^# (.*$)/i, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");

    const unorderedMatch = line.match(/^[-*]\s+(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);

    if (unorderedMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ul class="list-disc pl-6 space-y-1 my-3">');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${unorderedMatch[1]}</li>`);
    } else if (orderedMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ol class="list-decimal pl-6 space-y-1 my-3">');
        inList = true;
        listType = 'ol';
      }
      result.push(`<li>${orderedMatch[1]}</li>`);
    } else {
      if (inList) {
        result.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      
      if (line.startsWith('<h')) {
        result.push(line);
      } else if (line.trim() === '') {
        result.push('');
      } else {
        result.push(`<p>${line}</p>`);
      }
    }
  }

  if (inList) {
    result.push(listType === 'ol' ? '</ol>' : '</ul>');
  }

  return result.join('\n').replace(/<\/p>\n<p>/g, '</p><p>').replace(/\n\n+/g, '\n');
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
  lastDate,
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

  const formattedLastDate = lastDate
    ? new Date(lastDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const tooltipText = "Opens your default email client with the message pre-filled";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-col gap-2 md:shrink-0 md:pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="lg" className="w-full gap-2 px-6 text-base md:w-auto">
                    <a href={mailtoLink}>
                      <PaperPlaneTiltIcon weight="fill" />
                      Send Email
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="hidden md:block max-w-sm">
                  {tooltipText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-center text-xs text-muted-foreground md:hidden">
              {tooltipText}
            </p>
          </div>
        </div>
        
      </div>

      {formattedLastDate && (
        <Alert variant="default" className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <WarningCircleIcon className="size-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Last date to send this email: <strong>{formattedLastDate}</strong>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8 border-2 border-primary/20 bg-primary/2">
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

          <Separator className="my-2 h-0.5! bg-primary/10" />

          <div>
            <div
              className="prose prose-stone dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
