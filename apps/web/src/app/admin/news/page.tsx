"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { FileText, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi, type ContentStatus, type NewsArticle } from "@/lib/admin/api";
import { ImageUploader } from "@/components/admin/image-uploader";

const statusOptions: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

interface NewsFormState {
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  status: ContentStatus;
}

const emptyForm: NewsFormState = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  featuredImage: "",
  status: "DRAFT"
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewsFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.listNews({ limit: 50 });
      setArticles(res.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(article: NewsArticle) {
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      featuredImage: article.featuredImage ?? "",
      status: article.status
    });
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        slug: form.slug,
        summary: form.summary,
        content: form.content,
        status: form.status
      };
      if (form.featuredImage) {
        payload.featuredImage = form.featuredImage;
      }
      if (editing) {
        await adminApi.updateNews(editing.id, payload);
      } else {
        await adminApi.createNews(payload);
      }
      closeForm();
      await loadArticles();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save article.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(article: NewsArticle) {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteNews(article.id);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage news articles and events.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Article
        </Button>
      </div>

      {error ? (
        <div role="alert" className="rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      {showForm ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editing ? "Edit Article" : "New Article"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="text-gray-500 hover:text-gray-900"
              aria-label="Close form"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {formError ? (
            <div role="alert" className="mb-4 rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
              {formError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor="title" required>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Field>
              <Field label="Slug" htmlFor="slug" required>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  placeholder="my-article-slug"
                />
              </Field>
            </div>

            <Field label="Summary" htmlFor="summary" required>
              <Textarea
                id="summary"
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                required
              />
            </Field>

            <Field label="Content" htmlFor="content" required>
              <Textarea
                id="content"
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Featured Image">
                <ImageUploader
                  value={form.featuredImage}
                  onChange={(url) => setForm({ ...form, featuredImage: url })}
                  label="Featured Image"
                />
              </Field>
              <Field label="Status" htmlFor="status" required>
                <Select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editing ? (
                  "Save Changes"
                ) : (
                  "Create Article"
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
          <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin text-brand-gold" />
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-gold/10">
            <FileText aria-hidden="true" className="h-6 w-6 text-brand-gold" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">No articles yet</h2>
          <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
            Create your first news article to get started.
          </p>
          <Button className="mt-4" onClick={openCreate}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New Article
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{article.title}</p>
                    <p className="text-xs text-gray-500">/{article.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(article)}>
                        <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(article)}>
                        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}