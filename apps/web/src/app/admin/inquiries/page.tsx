"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Inbox, Loader2, Mail, Phone } from "lucide-react";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi, type ContactInquiry, type InquiryStatus } from "@/lib/admin/api";

const statusOptions: InquiryStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.listInquiries({ limit: 50 });
      setInquiries(res.inquiries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  async function handleStatusChange(inquiry: ContactInquiry, status: InquiryStatus) {
    setUpdatingId(inquiry.id);
    try {
      await adminApi.updateInquiry(inquiry.id, { status });
      setInquiries((prev) =>
        prev.map((item) => (item.id === inquiry.id ? { ...item, status } : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and respond to contact inquiries.
        </p>
      </div>

      {error ? (
        <div role="alert" className="rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
          <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin text-brand-gold" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-gold/10">
            <Inbox aria-hidden="true" className="h-6 w-6 text-brand-gold" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">No inquiries yet</h2>
          <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
            Inquiries submitted through the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-gold/10">
                    <Mail aria-hidden="true" className="h-5 w-5 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{inquiry.fullName}</p>
                    <p className="text-xs text-gray-500">{inquiry.subject}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(inquiry.submittedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={inquiry.status} />
                  <Select
                    aria-label="Change status"
                    value={inquiry.status}
                    disabled={updatingId === inquiry.id}
                    onChange={(e) =>
                      handleStatusChange(inquiry, e.target.value as InquiryStatus)
                    }
                    className="mt-0 w-40"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                    className="text-sm font-medium text-brand-gold hover:text-brand-gold-600"
                  >
                    {expandedId === inquiry.id ? "Hide" : "View"}
                  </button>
                </div>
              </div>

              {expandedId === inquiry.id ? (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
                      {inquiry.email}
                    </p>
                    {inquiry.phone ? (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
                        {inquiry.phone}
                      </p>
                    ) : null}
                    {inquiry.organization ? (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
                        {inquiry.organization}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4 rounded-md bg-gray-50 p-4">
                    <p className="text-sm leading-6 text-gray-700">{inquiry.message}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}