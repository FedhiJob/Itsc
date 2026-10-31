"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { BookOpen, Filter, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
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
import { DocumentUploader } from "@/components/admin/document-uploader";

const statusOptions: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

type Tab = "programs" | "categories";

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  sortOrder: number;
}

const emptyCategoryForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  parentId: "",
  sortOrder: 0
};

interface ProgramFormState {
  categoryId: string;
  title: string;
  slug: string;
  code: string;
  sortOrder: number;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  deliveryMode: string;
  level: string;
  featuredImage: string;
  outlineText: string;
  outlineFileUrl: string;
  objectives: string;
  prerequisites: string;
  isFeatured: boolean;
  status: ContentStatus;
}

const emptyProgramForm: ProgramFormState = {
  categoryId: "",
  title: "",
  slug: "",
  code: "",
  sortOrder: 0,
  shortDescription: "",
  fullDescription: "",
  duration: "",
  deliveryMode: "",
  level: "",
  featuredImage: "",
  outlineText: "",
  outlineFileUrl: "",
  objectives: "",
  prerequisites: "",
  isFeatured: false,
  status: "DRAFT"
};

export default function AdminTrainingPage() {
  const [tab, setTab] = useState<Tab>("programs");
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters for programs table
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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
        adminApi.listPrograms({ limit: 500 })
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

  // Candidates for parent category in category form (top-level only, cannot be self)
  const parentCategoryCandidates = useMemo(() => {
    return categories.filter(
      (c) => !c.parentId && (!editingCategory || c.id !== editingCategory.id)
    );
  }, [categories, editingCategory]);

  // Formatted category options for program form selection
  const formattedCategoryOptions = useMemo(() => {
    return [...categories]
      .sort((a, b) => {
        const aLabel = a.parent ? `${a.parent.name} → ${a.name}` : a.name;
        const bLabel = b.parent ? `${b.parent.name} → ${b.name}` : b.name;
        return aLabel.localeCompare(bLabel);
      })
      .map((cat) => ({
        id: cat.id,
        label: cat.parent ? `${cat.parent.name} → ${cat.name}` : cat.name
      }));
  }, [categories]);

  // Filtered programs based on search and category filter
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (filterCategory !== "all") {
        const matchesCategory =
          p.categoryId === filterCategory ||
          p.category?.parentId === filterCategory;
        if (!matchesCategory) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCode = p.code?.toLowerCase().includes(q) ?? false;
        const matchesSlug = p.slug.toLowerCase().includes(q);
        const matchesCat = p.category?.name.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesCode && !matchesSlug && !matchesCat) return false;
      }
      return true;
    });
  }, [programs, filterCategory, searchQuery]);

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
      description: category.description ?? "",
      parentId: category.parentId ?? "",
      sortOrder: category.sortOrder ?? 0
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
      const payload: {
        name: string;
        slug: string;
        description?: string;
        parentId?: string | null;
        sortOrder?: number;
      } = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim(),
        parentId: categoryForm.parentId ? categoryForm.parentId : null,
        sortOrder: Number(categoryForm.sortOrder) || 0
      };
      if (categoryForm.description.trim()) {
        payload.description = categoryForm.description.trim();
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
      code: program.code ?? "",
      sortOrder: program.sortOrder ?? 0,
      shortDescription: program.shortDescription,
      fullDescription: program.fullDescription,
      duration: program.duration ?? "",
      deliveryMode: program.deliveryMode ?? "",
      level: program.level ?? "",
      featuredImage: program.featuredImage ?? "",
      outlineText: program.outlineText ?? "",
      outlineFileUrl: program.outlineFileUrl ?? "",
      objectives: Array.isArray(program.objectives) ? program.objectives.join("\n") : "",
      prerequisites: Array.isArray(program.prerequisites) ? program.prerequisites.join("\n") : "",
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
        title: programForm.title.trim(),
        slug: programForm.slug.trim(),
        code: programForm.code.trim() || null,
        sortOrder: Number(programForm.sortOrder) || 0,
        shortDescription: programForm.shortDescription.trim(),
        fullDescription: programForm.fullDescription.trim(),
        isFeatured: programForm.isFeatured,
        status: programForm.status,
        objectives: programForm.objectives
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        prerequisites: programForm.prerequisites
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      };
      if (programForm.duration.trim()) payload.duration = programForm.duration.trim();
      if (programForm.deliveryMode.trim()) payload.deliveryMode = programForm.deliveryMode.trim();
      if (programForm.level.trim()) payload.level = programForm.level.trim();
      if (programForm.featuredImage.trim()) payload.featuredImage = programForm.featuredImage.trim();
      payload.outlineText = programForm.outlineText.trim() || null;
      payload.outlineFileUrl = programForm.outlineFileUrl.trim() || null;

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
            Manage course catalog, vendor hierarchy, and curriculum details.
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

      {/* Program form modal/card */}
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
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field label="Course Title" htmlFor="prog-title" required>
                  <Input
                    id="prog-title"
                    value={programForm.title}
                    onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                    placeholder="e.g. CompTIA Security+ or Azure Fundamentals"
                    required
                  />
                </Field>
              </div>
              <div>
                <Field label="Course Code" htmlFor="prog-code">
                  <Input
                    id="prog-code"
                    value={programForm.code}
                    onChange={(e) => setProgramForm({ ...programForm, code: e.target.value })}
                    placeholder="e.g. SY0-701, AZ-900"
                  />
                </Field>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" htmlFor="prog-slug" required>
                <Input
                  id="prog-slug"
                  value={programForm.slug}
                  onChange={(e) => setProgramForm({ ...programForm, slug: e.target.value })}
                  placeholder="comptia-security-plus"
                  required
                />
              </Field>
              <Field label="Category & Track" htmlFor="prog-category" required>
                <Select
                  id="prog-category"
                  value={programForm.categoryId}
                  onChange={(e) => setProgramForm({ ...programForm, categoryId: e.target.value })}
                  required
                >
                  {formattedCategoryOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
                <p className="mt-1 text-xs text-gray-500">Only published programs appear publicly.</p>
              </Field>
              <Field label="Featured on Home">
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
              <Field label="Sort Order" htmlFor="prog-sort">
                <Input
                  id="prog-sort"
                  type="number"
                  value={programForm.sortOrder}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, sortOrder: Number(e.target.value) || 0 })
                  }
                />
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
                placeholder="Brief summary shown in course listings and search cards."
                required
              />
            </Field>

            <Field label="Full Description" htmlFor="prog-full" required>
              <Textarea
                id="prog-full"
                rows={5}
                value={programForm.fullDescription}
                onChange={(e) =>
                  setProgramForm({ ...programForm, fullDescription: e.target.value })
                }
                placeholder="Comprehensive description of curriculum, target audience, and training outcomes."
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Duration" htmlFor="prog-duration">
                <Input
                  id="prog-duration"
                  value={programForm.duration}
                  onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                  placeholder="e.g. 5 Days or 40 Hours"
                />
              </Field>
              <Field label="Delivery Mode" htmlFor="prog-delivery">
                <Input
                  id="prog-delivery"
                  value={programForm.deliveryMode}
                  onChange={(e) => setProgramForm({ ...programForm, deliveryMode: e.target.value })}
                  placeholder="e.g. Instructor-led Classroom / Virtual"
                />
              </Field>
              <Field label="Skill Level" htmlFor="prog-level">
                <Input
                  id="prog-level"
                  value={programForm.level}
                  onChange={(e) => setProgramForm({ ...programForm, level: e.target.value })}
                  placeholder="e.g. Foundation / Intermediate / Advanced"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Learning Objectives (One per line)" htmlFor="prog-objectives">
                <Textarea
                  id="prog-objectives"
                  rows={4}
                  value={programForm.objectives}
                  onChange={(e) => setProgramForm({ ...programForm, objectives: e.target.value })}
                  placeholder="Understand threat landscapes&#10;Implement security controls&#10;Configure firewalls"
                />
              </Field>
              <Field label="Prerequisites (One per line)" htmlFor="prog-prerequisites">
                <Textarea
                  id="prog-prerequisites"
                  rows={4}
                  value={programForm.prerequisites}
                  onChange={(e) => setProgramForm({ ...programForm, prerequisites: e.target.value })}
                  placeholder="CompTIA Network+ or equivalent experience&#10;2 years hands-on networking background"
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

            <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/[0.04] p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-brand-ink">
                  Course Outline & Brochure <span className="text-sm font-normal text-gray-500">(optional)</span>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add detailed syllabus modules or attach a downloadable PDF outline.
                </p>
              </div>
              <div className="space-y-4">
                <Field label="Outline Syllabus Text" htmlFor="prog-outline-text">
                  <Textarea
                    id="prog-outline-text"
                    rows={5}
                    value={programForm.outlineText}
                    onChange={(e) => setProgramForm({ ...programForm, outlineText: e.target.value })}
                    placeholder="Module 1: Architecture and Design&#10;Module 2: Threats, Attacks, and Vulnerabilities..."
                  />
                </Field>
                <Field label="Outline Document (PDF)">
                  <DocumentUploader
                    value={programForm.outlineFileUrl}
                    onChange={(url) => setProgramForm({ ...programForm, outlineFileUrl: url })}
                  />
                </Field>
              </div>
            </div>

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
              <Field label="Category Name" htmlFor="cat-name" required>
                <Input
                  id="cat-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Cisco or CCNA"
                  required
                />
              </Field>
              <Field label="Slug" htmlFor="cat-slug" required>
                <Input
                  id="cat-slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g. cisco or cisco-ccna"
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Parent Vendor / Category (Optional)" htmlFor="cat-parent">
                <Select
                  id="cat-parent"
                  value={categoryForm.parentId}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                >
                  <option value="">None (Top-Level Vendor)</option>
                  {parentCategoryCandidates.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                <p className="mt-1 text-xs text-gray-500">
                  Select a vendor to make this a nested track (e.g. Cisco → CCNA).
                </p>
              </Field>
              <Field label="Sort Order" htmlFor="cat-sort">
                <Input
                  id="cat-sort"
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, sortOrder: Number(e.target.value) || 0 })
                  }
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
                placeholder="Brief summary of this vendor or curriculum track."
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

      {/* Tab content: Programs */}
      {!loading && tab === "programs" ? (
        <div className="space-y-4">
          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title, code (e.g. AZ-900), or track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-1.5 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter aria-hidden="true" className="h-4 w-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter by category"
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              >
                <option value="all">All Vendors & Categories</option>
                {formattedCategoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-gold/10">
                <BookOpen aria-hidden="true" className="h-6 w-6 text-brand-gold" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {programs.length === 0 ? "No programs yet" : "No matching programs"}
              </h2>
              <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
                {programs.length === 0
                  ? "Create a category first, then add your first program."
                  : "Try clearing your search query or category filter."}
              </p>
              {programs.length === 0 ? (
                <Button className="mt-4" onClick={openCreateProgram}>
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  New Program
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-2.5 text-xs text-gray-500">
                Showing {filteredPrograms.length} of {programs.length} total courses
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Vendor / Track
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Duration
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
                    {filteredPrograms.map((program) => (
                      <tr key={program.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {program.code ? (
                              <span className="inline-flex items-center rounded bg-brand-gold/15 px-2 py-0.5 font-mono text-xs font-semibold text-brand-ink">
                                {program.code}
                              </span>
                            ) : null}
                            <p className="text-sm font-medium text-gray-900">{program.title}</p>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-500">/{program.slug}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {program.category?.parent ? (
                            <span>
                              <span className="text-gray-400">{program.category.parent.name} → </span>
                              <span className="font-medium text-gray-800">{program.category.name}</span>
                            </span>
                          ) : (
                            <span className="font-medium text-gray-800">{program.category?.name ?? "—"}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {program.duration ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={program.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {program.isFeatured ? (
                            <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                              Featured
                            </span>
                          ) : (
                            "No"
                          )}
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
            </div>
          )}
        </div>
      ) : null}

      {/* Tab content: Categories */}
      {!loading && tab === "categories" ? (
        categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-gold/10">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-brand-gold" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No categories yet</h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Create your first training category or vendor.
            </p>
            <Button className="mt-4" onClick={openCreateCategory}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              New Category
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-2.5 text-xs text-gray-500">
              {categories.filter((c) => !c.parentId).length} Top-level Vendors • {categories.filter((c) => Boolean(c.parentId)).length} Nested Tracks
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Hierarchy Role
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
                    <td className="px-6 py-4">
                      {category.parent ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          Subcategory of {category.parent.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          Top-Level Vendor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category._count?.programs ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-xs text-gray-500">/{category.slug}</td>
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
