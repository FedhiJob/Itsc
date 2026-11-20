import { Loading } from "@/components/ui/loading";

export default function RootLoading() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center py-20">
      <Loading variant="page" text="Loading ITSC..." />
    </div>
  );
}
