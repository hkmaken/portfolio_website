"use client";

import { useState } from "react";
import { toast } from "sonner";
import { site } from "@/config/site";
import { contactSchema } from "@/lib/contact.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((i) => [String(i.path[0]), i.message]),
        ),
      );
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("send failed");
      toast.success("Thanks — your message has been sent.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please email me directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="mt-1.5"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-1.5"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="mt-1.5"
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from users, catches bots */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" disabled={sending} size="lg">
        {sending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
