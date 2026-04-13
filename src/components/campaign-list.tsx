'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  EnvelopeSimpleIcon,
  EyeIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Recipient {
  name: string;
  email: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  lastDate: string | null;
  createdAt: string;
  emailTo: Recipient[];
  emailCc: Recipient[];
  emailBcc: Recipient[];
}

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({
  campaigns: initialCampaigns,
}: CampaignListProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      setCampaigns((prev) => prev.filter((c) => c.id !== campaignToDelete.id));
      toast.success('Campaign deleted successfully');
    } catch (error) {
      toast.error('Failed to delete campaign');
      console.error(error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (campaigns.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <EnvelopeSimpleIcon className="text-muted-foreground mb-4 size-12" />
          <CardTitle className="mb-2 text-xl">No campaigns yet</CardTitle>
          <CardDescription className="mb-6 text-center">
            Create your first email campaign to get started.
          </CardDescription>
          <Button asChild>
            <a href="/admin/campaigns/new">
              <PlusIcon data-icon="inline-start" />
              Create Campaign
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>Manage your email campaigns</CardDescription>
          </div>
          <Button asChild>
            <a href="/admin/campaigns/new">
              <PlusIcon data-icon="inline-start" />
              New Campaign
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-medium">
                        {campaign.title}
                      </span>
                      <span className="text-muted-foreground line-clamp-1 text-sm">
                        {campaign.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(campaign.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {campaign.lastDate ? (
                      <span className="text-muted-foreground text-sm">
                        {formatDate(campaign.lastDate)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {campaign.emailTo.length} recipient
                      {campaign.emailTo.length !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" size="sm" asChild>
                        <a
                          href={`/campaigns/${campaign.id}`}
                          target="_blank"
                          rel="noopener"
                        >
                          <EyeIcon />
                          View
                        </a>
                      </Button>
                      <Button variant="secondary" size="sm" asChild>
                        <a href={`/admin/campaigns/${campaign.id}/edit`}>
                          <PencilSimpleIcon />
                          Edit
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(campaign)}
                      >
                        <TrashIcon />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{campaignToDelete?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
