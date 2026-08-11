"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BookOpen, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  adminApi,
  type ContentStatus,
  type TrainingCategory,
  type TrainingProgram
} from "@/lib/admin/api";
import { ImageUploader } from "@/components/admin/image-uploader";

const statusOptions: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

type Tab = "programs" | "categories";

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
}

const emptyCategoryForm: CategoryFormState = { name: "", slug: "", description: "" };

interface ProgramFormState {
  categoryId: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  deliveryMode: string;
  level: string;
  featuredImage: string;
  isFeatured: boolean;
  status: ContentStatus;
}

const emptyProgramForm: ProgramFormState = {
  categoryId: "",
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  duration: "",
  deliveryMode: "",
  level: "",
  featuredImage: "",
  isFeatured: false,
  status: "DRAFT"
};

export default function AdminTrainingPage() {
  const [tab, setTab] = useState<Tab>("programs");
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TrainingCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);

  // Program form state
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [programForm, setProgramForm] = useState<ProgramFormState>(emptyProgramForm);
  const [savingProgram, setSavingProgram] = useState(false);
  const [programFormError, setProgramFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, progs] = await Promise.all([
        adminApi.listCategories(),
        adminApi.listPrograms({ limit: 50 })
      ]);
      setCategories(cats);
      setPrograms(progs.programs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load training data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Category handlers ---
  function openCreateCategory() {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm);
    setCategoryFormError(null);
    setShowCategoryForm(true);
  }

  function openEditCategory(category: TrainingCategory) {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? ""
    });
    setCategoryFormError(null);
    setShowCategoryForm(true);
  }

  function closeCategoryForm() {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryFormError(null);
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCategory(true);
    setCategoryFormError(null);
    try {
      const payload: { name: string; slug: string; description?: string } = {
        name: categoryForm.name,
        slug: categoryForm.slug
      };
      if (categoryForm.description) {
        payload.description = categoryForm.description;
      }
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, payload);
      } else {
        await adminApi.createCategory(payload);
      }
      closeCategoryForm();
      await loadData();
    } catch (err) {
      setCategoryFormError(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(category: TrainingCategory) {
    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return;
    }
    try {
      await adminApi.deleteCategory(category.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    }
  }

  // --- Program handlers ---
  function openCreateProgram() {
    setEditingProgram(null);
    setProgramForm({
      ...emptyProgramForm,
      categoryId: categories[0]?.id ?? ""
    });
    setProgramFormError(null);
    setShowProgramForm(true);
  }

  function openEditProgram(program: TrainingProgram) {
    setEditingProgram(program);
    setProgramForm({
      categoryId: program.categoryId,
      title: program.title,
      slug: program.slug,
      shortDescription: program.shortDescription,
      fullDescription: program.fullDescription,
      duration: program.duration ?? "",
      deliveryMode: program.deliveryMode ?? "",
      level: program.level ?? "",
      featuredImage: program.featuredImage ?? "",
      isFeatured: program.isFeatured,
      status: program.status
    });
    setProgramFormError(null);
    setShowProgramForm(true);
  }

  function closeProgramForm() {
    setShowProgramForm(false);
    setEditingProgram(null);
    setProgramFormError(null);
  }

  async function handleProgramSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProgram(true);
    setProgramFormError(null);
    try {
      const payload: Record<string, unknown> = {
        categoryId: programForm.categoryId,
        title: programForm.title,
        slug: programForm.slug,
        shortDescription: programForm.shortDescription,
        fullDescription: programForm.fullDescription,
        isFeatured: programForm.isFeatured,
        status: programForm.status
      };
      if (programForm.duration) payload.duration = programForm.duration;
      if (programForm.deliveryMode) payload.deliveryMode = programForm.deliveryMode;
      if (programForm.level) payload.level = programForm.level;
      if (programForm.featuredImage) payload.featuredImage = programForm.featuredImage;
      if (editingProgram) {
        await adminApi.updateProgram(editingProgram.id, payload);
      } else {
        await adminApi.createProgram(payload);
      }
      closeProgramForm();
      await loadData();
    } catch (err) {
      setProgramFormError(err instanceof Error ? err.message : "Failed to save program.");
    } finally {
      setSavingProgram(false);
    }
  }

  async function handleDeleteProgram(program: TrainingProgram) {
    if (!window.confirm(`Delete program "${program.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteProgram(program.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete program.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Programs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage training categories and programs.
          </p>
        </div>
        {tab === "programs" ? (
          <Button onClick={openCreateProgram} disabled={categories.length === 0}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New Program
          </Button>
        ) : (
          <Button onClick={openCreateCategory}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New Category
          </Button>
        )}
      </div>

      <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setTab("programs")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "programs"
              ? "bg-brand-gold/10 text-brand-gold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Programs ({programs.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("categories")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "categories"
              ? "bg-brand-gold/10 text-brand-gold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Categories ({categories.length})
        </button>
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
      ) : null}

      {/* Program form */}
      {showProgramForm ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingProgram ? "Edit Program" : "New Program"}
            </h2>
            <button
              type="button"
              onClick={closeProgramForm}
              className="text-gray-500 hover:text-gray-900"
              aria-label="Close form"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {programFormError ? (
            <div role="alert" className="mb-4 rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
              {programFormError}
            </div>
          ) : null}

          <form onSubmit={handleProgramSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor="prog-title" required>
                <Input
                  id="prog-title"
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  required
                />
              </Field>
              <Field label="Slug" htmlFor="prog-slug" required>
                <Input
                  id="prog-slug"
                  value={programForm.slug}
                  onChange={(e) => setProgramForm({ ...programForm, slug: e.target.value })}
                  required
                  placeholder="program-slug"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category" htmlFor="prog-category" required>
                <Select
                  id="prog-category"
                  value={programForm.categoryId}
                  onChange={(e) => setProgramForm({ ...programForm, categoryId: e.target.value })}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Status" htmlFor="prog-status" required>
                <Select
                  id="prog-status"
                  value={programForm.status}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, status: e.target.value as ContentStatus })
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Featured">
                <Select
                  id="prog-featured"
                  value={programForm.isFeatured ? "true" : "false"}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, isFeatured: e.target.value === "true" })
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </Select>
              </Field>
            </div>

            <Field label="Short Description" htmlFor="prog-short" required>
              <Textarea
                id="prog-short"
                rows={2}
                value={programForm.shortDescription}
                onChange={(e) =>
                  setProgramForm({ ...programForm, shortDescription: e.target.value })
                }
                required
              />
            </Field>

            <Field label="Full Description" htmlFor="prog-full" required>
              <Textarea
                id="prog-full"
                rows={6}
                value={programForm.fullDescription}
                onChange={(e) =>
                  setProgramForm({ ...programForm, fullDescription: e.target.value })
                }
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Duration" htmlFor="prog-duration">
                <Input
                  id="prog-duration"
                  value={programForm.duration}
                  onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                  placeholder="6 weeks"
                />
              </Field>
              <Field label="Delivery Mode" htmlFor="prog-delivery">
                <Input
                  id="prog-delivery"
                  value={programForm.deliveryMode}
                  onChange={(e) => setProgramForm({ ...programForm, deliveryMode: e.target.value })}
                  placeholder="Online"
                />
              </Field>
              <Field label="Level" htmlFor="prog-level">
                <Input
                  id="prog-level"
                  value={programForm.level}
                  onChange={(e) => setProgramForm({ ...programForm, level: e.target.value })}
                  placeholder="Beginner"
                />
              </Field>
            </div>

            <Field label="Featured Image">
              <ImageUploader
                value={programForm.featuredImage}
                onChange={(url) => setProgramForm({ ...programForm, featuredImage: url })}
                label="Featured Image"
              />
            </Field>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeProgramForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingProgram}>
                {savingProgram ? (
                  <>
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingProgram ? (
                  "Save Changes"
                ) : (
                  "Create Program"
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : showCategoryForm ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingCategory ? "Edit Category" : "New Category"}
            </h2>
            <button
              type="button"
              onClick={closeCategoryForm}
              className="text-gray-500 hover:text-gray-900"
              aria-label="Close form"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {categoryFormError ? (
            <div role="alert" className="mb-4 rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
              {categoryFormError}
            </div>
          ) : null}

          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="cat-name" required>
                <Input
                  id="cat-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </Field>
              <Field label="Slug" htmlFor="cat-slug" required>
                <Input
                  id="cat-slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  required
                  placeholder="category-slug"
                />
              </Field>
            </div>

            <Field label="Description" htmlFor="cat-description">
              <Textarea
                id="cat-description"
                rows={3}
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, description: e.target.value })
                }
              />
            </Field>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeCategoryForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingCategory}>
                {savingCategory ? (
                  <>
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingCategory ? (
                  "Save Changes"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Tab content */}
      {!loading && tab === "programs" ? (
        programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-gold/10">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-brand-gold" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No programs yet</h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
              {categories.length === 0
                ? "Create a category first, then add your first program."
                : "Create your first training program."}
            </p>
            <Button className="mt-4" onClick={openCreateProgram}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              New Program
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
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {programs.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{program.title}</p>
                      <p className="text-xs text-gray-500">/{program.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {program.category?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={program.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {program.isFeatured ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditProgram(program)}>
                          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProgram(program)}>
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
        )
      ) : null}

      {!loading && tab === "categories" ? (
        categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-gold/10">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-brand-gold" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No categories yet</h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Create your first training category.
            </p>
            <Button className="mt-4" onClick={openCreateCategory}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              New Category
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Programs
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
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      {category.description ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                          {category.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category._count?.programs ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">/{category.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditCategory(category)}>
                          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category)}>
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
        )
      ) : null}
    </div>
  );
}