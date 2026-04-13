"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvelopeSimpleIcon, PlusIcon, TrashIcon, UserIcon } from "@phosphor-icons/react";

interface Recipient {
  name: string;
  email: string;
}

interface RecipientFieldsProps {
  label: string;
  description?: string;
  recipients: Recipient[];
  onChange: (recipients: Recipient[]) => void;
  required?: boolean;
}

export function RecipientFields({
  label,
  description,
  recipients,
  onChange,
  required = false,
}: RecipientFieldsProps) {
  const handleAdd = () => {
    onChange([...recipients, { name: "", email: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(recipients.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Recipient, value: string) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </CardTitle>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            <PlusIcon data-icon="inline-start" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {recipients.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No recipients added yet. Click "Add" to add a recipient.
          </p>
        ) : (
          recipients.map((recipient, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <Label htmlFor={`${label}-name-${index}`} className="mb-2 flex items-center gap-1">
                  <UserIcon className="size-3" />
                  Name
                </Label>
                <Input
                  id={`${label}-name-${index}`}
                  value={recipient.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`${label}-email-${index}`} className="mb-2 flex items-center gap-1">
                  <EnvelopeSimpleIcon className="size-3" />
                  Email
                </Label>
                <Input
                  id={`${label}-email-${index}`}
                  type="email"
                  value={recipient.email}
                  onChange={(e) => handleChange(index, "email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="text-destructive hover:text-destructive"
              >
                <TrashIcon data-icon="inline-start" />
                Remove
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
