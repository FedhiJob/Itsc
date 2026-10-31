"use client";

import { useCallback, useEffect, useState, Fragment, type FormEvent } from "react";
import {
  ChevronDown,
  ChevronRight,
  Images,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  adminApi,
  type GalleryAlbum,
  type GalleryAlbumWithImages,
  type GalleryImage
} from "@/lib/admin/api";
import { ImageUploader } from "@/components/admin/image-uploader";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AlbumFormState {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
}

interface ImageAddFormState {
  altText: string;
  caption: string;
}

const emptyAlbumForm: AlbumFormState = {
  title: "",
  slug: "",
  description: "",
  coverImage: ""
};

const emptyImageForm: ImageAddFormState = { altText: "", caption: "" };

// ---------------------------------------------------------------------------
// AlbumImagePanel — manages images inside a single album
// ---------------------------------------------------------------------------

interface AlbumImagePanelProps {
  album: GalleryAlbum;
  onCountChange: (albumId: string, newCount: number) => void;
}

function AlbumImagePanel({ album, onCountChange }: AlbumImagePanelProps) {
  const [data, setData] = useState<GalleryAlbumWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add image form state
  const [pendingUrl, setPendingUrl] = useState("");
  const [imageForm, setImageForm] = useState<ImageAddFormState>(emptyImageForm);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit image state
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editForm, setEditForm] = useState<ImageAddFormState>(emptyImageForm);
  const [editSaving, setEditSaving] = useState(false);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.getAlbumWithImages(album.slug);
      setData(result);
      onCountChange(album.id, result.images.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images.");
    } finally {
      setLoading(false);
    }
  }, [album.id, album.slug, onCountChange]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleAddImage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pendingUrl) {
      setAddError("Please upload an image first.");
      return;
    }
    if (!imageForm.altText.trim()) {
      setAddError("Alt text is required for accessibility.");
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      await adminApi.addImageToAlbum(album.id, {
        imageUrl: pendingUrl,
        altText: imageForm.altText.trim(),
        ...(imageForm.caption.trim() ? { caption: imageForm.caption.trim() } : {})
      });
      setPendingUrl("");
      setImageForm(emptyImageForm);
      await loadImages();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add image.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteImage(image: GalleryImage) {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    try {
      await adminApi.deleteGalleryImage(image.id);
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image.");
    }
  }

  function openEditImage(image: GalleryImage) {
    setEditingImage(image);
    setEditForm({ altText: image.altText, caption: image.caption ?? "" });
  }

  async function handleSaveEditImage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingImage) return;
    setEditSaving(true);
    try {
      await adminApi.updateGalleryImage(editingImage.id, {
        altText: editForm.altText.trim(),
        ...(editForm.caption.trim() ? { caption: editForm.caption.trim() } : {})
      });
      setEditingImage(null);
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image.");
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Photos in &ldquo;{album.title}&rdquo;
      </h3>

      {error ? (
        <div role="alert" className="mb-3 rounded-md border border-error/20 bg-error/5 px-3 py-2 text-xs text-error">
          {error}
        </div>
      ) : null}

      {/* Image grid */}
      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          Loading images…
        </div>
      ) : data && data.images.length > 0 ? (
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.images.map((image) => (
            <div key={image.id} className="group relative">
              {/* Edit overlay */}
              {editingImage?.id === image.id ? (
                <div className="rounded-md border border-brand-gold/40 bg-white p-3">
                  <form onSubmit={handleSaveEditImage} className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600">Alt text *</label>
                      <input
                        className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-gold focus:outline-none"
                        value={editForm.altText}
                        onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600">Caption</label>
                      <input
                        className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-gold focus:outline-none"
                        value={editForm.caption}
                        onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="submit"
                        disabled={editSaving}
                        className="flex items-center gap-1 rounded bg-brand-gold px-2 py-1 text-[11px] font-medium text-brand-navy disabled:opacity-50"
                      >
                        {editSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingImage(null)}
                        className="rounded px-2 py-1 text-[11px] text-gray-500 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-md border border-gray-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="aspect-square w-full object-cover"
                  />
                  {/* Hover actions */}
                  <div className="absolute inset-0 flex items-end justify-between gap-1 bg-black/0 p-1.5 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openEditImage(image)}
                      aria-label="Edit image metadata"
                      className="rounded bg-white/90 p-1 text-gray-700 hover:text-brand-navy"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      aria-label="Delete image"
                      className="rounded bg-white/90 p-1 text-error hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
              {image.caption ? (
                <p className="mt-1 truncate text-[11px] text-gray-500">{image.caption}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-500">No photos yet. Upload one below.</p>
      )}

      {/* Add image form */}
      <form onSubmit={handleAddImage} className="rounded-md border border-dashed border-gray-300 bg-white p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Add Photo
        </p>

        {addError ? (
          <div role="alert" className="mb-3 rounded border border-error/20 bg-error/5 px-3 py-2 text-xs text-error">
            {addError}
          </div>
        ) : null}

        <div className="space-y-3">
          <ImageUploader
            value={pendingUrl}
            onChange={setPendingUrl}
            label="Photo"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`alt-${album.id}`} className="block text-xs font-medium text-gray-700">
                Alt text <span aria-hidden="true" className="text-error">*</span>
              </label>
              <Input
                id={`alt-${album.id}`}
                className="mt-1"
                value={imageForm.altText}
                onChange={(e) => setImageForm({ ...imageForm, altText: e.target.value })}
                placeholder="Describe the photo for screen readers"
                required
              />
            </div>
            <div>
              <label htmlFor={`caption-${album.id}`} className="block text-xs font-medium text-gray-700">
                Caption
              </label>
              <Input
                id={`caption-${album.id}`}
                className="mt-1"
                value={imageForm.caption}
                onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
                placeholder="Optional visible caption"
              />
            </div>
          </div>

          <Button type="submit" size="sm" disabled={adding || !pendingUrl}>
            {adding ? (
              <>
                <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                Adding…
              </>
            ) : (
              <>
                <UploadCloud aria-hidden="true" className="h-3.5 w-3.5" />
                Add to Album
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

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

  // Which album's image panel is expanded
  const [expandedAlbumId, setExpandedAlbumId] = useState<string | null>(null);

  // Track per-album image counts (updated when panel loads)
  const [imageCounts, setImageCounts] = useState<Record<string, number>>({});

  const handleCountChange = useCallback((albumId: string, count: number) => {
    setImageCounts((prev) => ({ ...prev, [albumId]: count }));
  }, []);

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.listAlbums({ limit: 50 });
      setAlbums(res.albums);
      const counts: Record<string, number> = {};
      for (const album of res.albums) {
        counts[album.id] = album._count?.images ?? 0;
      }
      setImageCounts(counts);
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

  function toggleImagePanel(albumId: string) {
    setExpandedAlbumId((prev) => (prev === albumId ? null : albumId));
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
    if (
      !window.confirm(
        `Delete album "${album.title}"? This will permanently remove all images in it.`
      )
    ) {
      return;
    }
    try {
      await adminApi.deleteAlbum(album.id);
      if (expandedAlbumId === album.id) setExpandedAlbumId(null);
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

      {/* Album create / edit form */}
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

            <Field label="Cover Image">
              <ImageUploader
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
                label="Cover Image"
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

      {/* Album list */}
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
                  Photos
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
              {albums.map((album) => {
                const isExpanded = expandedAlbumId === album.id;
                return (
                  <Fragment key={album.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{album.title}</p>
                        {album.description ? (
                          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                            {album.description}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {imageCounts[album.id] ?? album._count?.images ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">/{album.slug}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleImagePanel(album.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`image-panel-${album.id}`}
                          >
                            {isExpanded ? (
                              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                            )}
                            Photos
                          </Button>
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
                    {isExpanded ? (
                      <tr id={`image-panel-${album.id}`}>
                        <td colSpan={4} className="p-0">
                          <AlbumImagePanel
                            album={album}
                            onCountChange={handleCountChange}
                          />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
