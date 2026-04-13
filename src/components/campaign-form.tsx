'use client';

import { RecipientFields } from '@/components/recipient-fields';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeftIcon,
  FloppyDiskIcon,
  SpinnerIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Recipient {
  name: string;
  email: string;
}

interface CampaignFormData {
  title: string;
  description: string;
  lastDate: string;
  emailTo: Recipient[];
  emailCc: Recipient[];
  emailBcc: Recipient[];
  content: string;
}

interface CampaignFormProps {
  initialData?: CampaignFormData;
  slug?: string;
  mode: 'create' | 'edit';
}

const defaultData: CampaignFormData = {
  title: '',
  description: '',
  lastDate: '',
  emailTo: [{ name: '', email: '' }],
  emailCc: [],
  emailBcc: [],
  content: '<p>Start writing your email content here...</p>',
};

export function CampaignForm({ initialData, slug, mode }: CampaignFormProps) {
  const [formData, setFormData] = useState<CampaignFormData>(
    initialData || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = <K extends keyof CampaignFormData>(
    field: K,
    value: CampaignFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Title is required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (formData.emailTo.length === 0) {
      return 'At least one recipient is required';
    }
    const invalidTo = formData.emailTo.some(
      (r) => !r.name.trim() || !r.email.trim()
    );
    if (invalidTo) {
      return "All 'To' recipients must have a name and email";
    }
    const invalidCc = formData.emailCc.some(
      (r) => !r.name.trim() || !r.email.trim()
    );
    if (invalidCc) {
      return "All 'CC' recipients must have a name and email";
    }
    const invalidBcc = formData.emailBcc.some(
      (r) => !r.name.trim() || !r.email.trim()
    );
    if (invalidBcc) {
      return "All 'BCC' recipients must have a name and email";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      const url =
        mode === 'create' ? '/api/campaigns' : `/api/campaigns/${slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to save campaign');
      }

      const data = (await response.json()) as { slug: string };
      toast.success(
        mode === 'create' ? 'Campaign created!' : 'Campaign updated!'
      );

      window.location.href = `/admin/campaigns/${data.slug}/edit`;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save campaign'
      );
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!slug) return;

    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/campaigns/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      toast.success('Campaign deleted!');
      window.location.href = '/admin/campaigns';
    } catch (error) {
      toast.error('Failed to delete campaign');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="sm" asChild>
            <a href="/admin/campaigns">
              <ArrowLeftIcon data-icon="inline-start" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {mode === 'create' ? 'Create Campaign' : 'Edit Campaign'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === 'create'
                ? 'Create a new email campaign'
                : 'Update your email campaign'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'edit' && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              {isDeleting ? (
                <SpinnerIcon
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : (
                <TrashIcon data-icon="inline-start" />
              )}
              Delete
            </Button>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <SpinnerIcon data-icon="inline-start" className="animate-spin" />
            ) : (
              <FloppyDiskIcon data-icon="inline-start" />
            )}
            {isSaving ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Basic information about your email campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Welcome to Our Newsletter"
              />
              <p className="text-muted-foreground text-xs">
                This will be used as the email subject line
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="A brief description of this campaign..."
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lastDate">Last Date (Optional)</Label>
              <Input
                id="lastDate"
                type="date"
                value={formData.lastDate}
                onChange={(e) => handleChange('lastDate', e.target.value)}
                className="max-w-xs"
              />
              <p className="text-muted-foreground text-xs">
                If set, this will be shown as the deadline to send this email
                campaign
              </p>
            </div>
          </CardContent>
        </Card>

        <RecipientFields
          label="To Recipients"
          description="Primary recipients of this email"
          recipients={formData.emailTo}
          onChange={(recipients) => handleChange('emailTo', recipients)}
          required
        />

        <RecipientFields
          label="CC Recipients"
          description="Carbon copy recipients (optional)"
          recipients={formData.emailCc}
          onChange={(recipients) => handleChange('emailCc', recipients)}
        />

        <RecipientFields
          label="BCC Recipients"
          description="Blind carbon copy recipients (optional)"
          recipients={formData.emailBcc}
          onChange={(recipients) => handleChange('emailBcc', recipients)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Email Content</CardTitle>
            <CardDescription>
              The body of your email. Use the toolbar to format your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleChange('content', content)}
            />
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <a href="/admin/campaigns">Cancel</a>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <SpinnerIcon data-icon="inline-start" className="animate-spin" />
            ) : (
              <FloppyDiskIcon data-icon="inline-start" />
            )}
            {isSaving ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </div>
    </form>
  );
}
