// Data access for the public Contact form — submits inquiries to the API.
import type { ApiSuccess } from "./client";
import { siteConfig } from "@/config/site";

export interface SubmitInquiryInput {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
}

export interface SubmitInquiryResult {
  success: boolean;
  message: string;
}

/** Submit a contact inquiry. Returns a structured result (never throws). */
export async function submitInquiry(
  input: SubmitInquiryInput
): Promise<SubmitInquiryResult> {
  try {
    const response = await fetch(`${siteConfig.apiUrl}/contact/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });

    const body = (await response.json().catch(() => null)) as
      | ApiSuccess<unknown>
      | null;

    return {
      success: response.ok,
      message:
        body?.message ??
        (response.ok ? "Your message has been sent." : "Failed to send message.")
    };
  } catch {
    return {
      success: false,
      message: "Unable to reach the server. Please try again later."
    };
  }
}
