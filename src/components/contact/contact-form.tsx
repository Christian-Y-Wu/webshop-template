'use client';

import { useState } from 'react';
import { Check, Send } from 'lucide-react';

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-card border border-line bg-surface p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/12 text-success">
          <Check size={26} />
        </div>
        <h2 className="mt-5 font-serif text-2xl">Message sent</h2>
        <p className="mt-2 text-sm text-ink-soft">Thanks for reaching out — we typically reply within a few hours.</p>
        <button onClick={() => setSent(false)} className="btn-outline mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-card border border-line bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">Name</span>
          <input required className="input" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">Email</span>
          <input required type="email" className="input" placeholder="you@example.com" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">Subject</span>
          <select className="input">
            <option>Order enquiry</option>
            <option>Returns & exchanges</option>
            <option>Product question</option>
            <option>Wholesale & press</option>
            <option>Something else</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">Message</span>
          <textarea required rows={5} className="input resize-none" placeholder="How can we help?" />
        </label>
      </div>
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
        <Send size={16} /> Send message
      </button>
    </form>
  );
}
