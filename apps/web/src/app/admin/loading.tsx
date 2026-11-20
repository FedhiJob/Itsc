import { Loading } from "@/components/ui/loading";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center py-16">
      <Loading variant="page" text="Loading Admin Portal..." />
    </div>
  );
}
