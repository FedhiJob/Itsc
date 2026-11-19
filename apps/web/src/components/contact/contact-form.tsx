"use client";

import { useState, type FormEvent } from "react";
import { submitInquiry, type SubmitInquiryInput } from "@/lib/api/contact";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  subjects: { value: string; label: string }[];
  requestedSubject: string | undefined;
  sourcePage: string | undefined;
  sourceLabel: string | undefined;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string | undefined;
  email?: string | undefined;
  message?: string | undefined;
}

export function ContactForm({ subjects, requestedSubject = "", sourcePage, sourceLabel }: Props) {
  const initialSubject = subjects.some((subject) => subject.value === requestedSubject)
    ? requestedSubject
    : subjects[0]?.value ?? "";

  const [state, setState] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    subject: initialSubject,
    message: ""
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function validateField(name: string, value: string): string | undefined {
    if (name === "fullName") {
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
    }
    if (name === "email") {
      if (!value.trim()) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
    }
    if (name === "message") {
      if (!value.trim()) return "Message cannot be empty.";
      if (value.trim().length < 10) return "Message must be at least 10 characters.";
    }
    return undefined;
  }

  const errors: FormErrors = {
    fullName: touched.fullName ? validateField("fullName", state.fullName) : undefined,
    email: touched.email ? validateField("email", state.email) : undefined,
    message: touched.message ? validateField("message", state.message) : undefined
  };

  function handleChange(name: keyof FormState, value: string) {
    setState((prev) => ({ ...prev, [name]: value }));
    // Clear global error when user continues typing
    if (errorMsg) setErrorMsg(null);
  }

  function handleBlur(name: string) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Mark all required fields as touched
    setTouched({
      fullName: true,
      email: true,
      message: true
    });

    const nameErr = validateField("fullName", state.fullName);
    const emailErr = validateField("email", state.email);
    const msgErr = validateField("message", state.message);

    if (nameErr || emailErr || msgErr) {
      return;
    }

    setErrorMsg(null);
    setStatus("submitting");

    const payload: SubmitInquiryInput = {
      fullName: state.fullName.trim(),
      email: state.email.trim(),
      subject: state.subject,
      message: state.message.trim()
    };
    if (state.phone.trim()) payload.phone = state.phone.trim();
    if (state.organization.trim()) payload.organization = state.organization.trim();
    if (sourcePage) payload.sourcePage = sourcePage;
    if (sourceLabel) payload.sourceLabel = sourceLabel;

    const result = await submitInquiry(payload);
    if (result.success) {
      setStatus("success");
      setState({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        subject: initialSubject,
        message: ""
      });
      setTouched({});
    } else {
      setStatus("error");
      setErrorMsg(result.message);
    }
  }

  return (
    <>
      {status === "success" ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Your message has been sent successfully. Our admissions team will be in touch shortly.</span>
        </div>
      ) : null}

      {status === "error" && errorMsg ? (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      {sourceLabel ? (
        <div className="rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-4 py-3 text-sm text-brand-ink">
          You&apos;re inquiring about: <strong>{sourceLabel}</strong>
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={state.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              className={`mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${
                errors.fullName
                  ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              }`}
              placeholder="Your name"
              disabled={status === "submitting"}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={state.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              }`}
              placeholder="you@example.com"
              disabled={status === "submitting"}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={state.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              placeholder="+251 9... (optional)"
              disabled={status === "submitting"}
            />
          </div>

          <div>
            <label htmlFor="organization" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Company / Organization
            </label>
            <input
              id="organization"
              type="text"
              value={state.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              placeholder="Company name (optional)"
              disabled={status === "submitting"}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Inquiry Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            required
            value={state.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
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
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Your Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={state.message}
            onChange={(e) => handleChange("message", e.target.value)}
            onBlur={() => handleBlur("message")}
            className={`mt-1.5 block w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-y transition-colors ${
              errors.message
                ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            }`}
            placeholder="How can we assist you with certification paths or corporate inquiries?"
            disabled={status === "submitting"}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="itsc-press inline-flex w-full items-center justify-center rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-brand-ink shadow-md hover:bg-brand-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:opacity-50"
        >
          {status === "submitting" ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-ink border-t-transparent" />
              <span>Sending inquiry...</span>
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </>
  );
}
