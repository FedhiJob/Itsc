import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-gray-100 text-gray-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
  NEW: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-green-100 text-green-800"
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}