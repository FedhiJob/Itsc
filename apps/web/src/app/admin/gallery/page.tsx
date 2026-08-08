"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Images, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, type GalleryAlbum } from "@/lib/admin/api";

interface AlbumFormState {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
}

const emptyAlbumForm: AlbumFormState = {
  title: "",
  slug: "",
  description: "",
  coverImage: ""
};

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Album form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryAlbum | null>(null);
  const [form, setForm] = useState<AlbumFormState>(emptyAlbumForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.listAlbums({ limit: 50 });
      setAlbums(res.albums);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load albums.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  function openCreate() {
    setEditing(null);
    setForm(emptyAlbumForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(album: GalleryAlbum) {
    setEditing(album);
    setForm({
      title: album.title,
      slug: album.slug,
      description: album.description ?? "",
      coverImage: album.coverImage ?? ""
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
        slug: form.slug
      };
      if (form.description) payload.description = form.description;
      if (form.coverImage) payload.coverImage = form.coverImage;
      if (editing) {
        await adminApi.updateAlbum(editing.id, payload);
      } else {
        const createInput: { title: string; slug: string; description?: string; coverImage?: string } = {
          title: form.title,
          slug: form.slug
        };
        if (form.description) createInput.description = form.description;
        if (form.coverImage) createInput.coverImage = form.coverImage;
        await adminApi.createAlbum(createInput);
      }
      closeForm();
      await loadAlbums();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save album.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(album: GalleryAlbum) {
    if (!window.confirm(`Delete album "${album.title}"? This will permanently remove all images in it.`)) {
      return;
    }
    try {
      await adminApi.deleteAlbum(album.id);
      await loadAlbums();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete album.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage photo albums and images.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Album
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
              {editing ? "Edit Album" : "New Album"}
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
              <Field label="Title" htmlFor="album-title" required>
                <Input
                  id="album-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Field>
              <Field label="Slug" htmlFor="album-slug" required>
                <Input
                  id="album-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  placeholder="album-slug"
                />
              </Field>
            </div>

            <Field label="Description" htmlFor="album-description">
              <Textarea
                id="album-description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>

            <Field label="Cover Image URL" htmlFor="album-cover">
              <Input
                id="album-cover"
                type="url"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://..."
              />
            </Field>

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
                  "Create Album"
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
      ) : albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-gold/10">
            <Images aria-hidden="true" className="h-6 w-6 text-brand-gold" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">No albums yet</h2>
          <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
            Create your first photo album to get started.
          </p>
          <Button className="mt-4" onClick={openCreate}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New Album
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
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {albums.map((album) => (
                <tr key={album.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{album.title}</p>
                    {album.description ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                        {album.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {album._count?.images ?? 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">/{album.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(album)}>
                        <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(album)}>
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