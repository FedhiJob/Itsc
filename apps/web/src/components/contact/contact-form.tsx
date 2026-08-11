"use client";

import { useState, type FormEvent } from "react";
import { submitInquiry, type SubmitInquiryInput } from "@/lib/api/contact";

interface Props {
  subjects: { value: string; label: string }[];
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
}

export function ContactForm({ subjects }: Props) {
  const [state, setState] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    subject: subjects[0]?.value ?? "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleChange(name: keyof FormState, value: string) {
    setState((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);
    setStatus("submitting");
    const payload: SubmitInquiryInput = {
      fullName: state.fullName,
      email: state.email,
      subject: state.subject,
      message: state.message
    };
    if (state.phone) payload.phone = state.phone;
    if (state.organization) payload.organization = state.organization;
    const result = await submitInquiry(payload);
    if (result.success) {
      setStatus("success");
      setState({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        subject: subjects[0]?.value ?? "",
        message: ""
      });
    } else {
      setStatus("error");
      setErrorMsg(result.message);
    }
  }

  return (
    <>
      {status === "success" ? (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Your message has been sent successfully. We'll be in touch soon.
        </div>
      ) : null}
      {status === "error" && errorMsg ? (
        <div role="alert" className="rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {errorMsg}
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={state.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              placeholder="Your name"
              disabled={status === "submitting"}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email <span className="text-error">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={state.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              placeholder="you@example.com"
              disabled={status === "submitting"}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={state.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
            placeholder="+251 9... (optional)"
            disabled={status === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-900">
            Organization
          </label>
          <input
            id="organization"
            type="text"
            value={state.organization}
            onChange={(e) => handleChange("organization", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
            placeholder="Your company (optional)"
            disabled={status === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-900">
            Subject <span className="text-error">*</span>
          </label>
          <select
            id="subject"
            required
            value={state.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
            disabled={status === "submitting"}
          >
            {subjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-900">
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={state.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold resize-y"
            placeholder="How can we help you?"
            disabled={status === "submitting"}
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center rounded-md bg-brand-gold px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </>
  );
}
