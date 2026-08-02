import { PageHeader } from "@/components/dashboard/page-header";
import { GearEditor } from "@/components/provider/gear-editor";

export const metadata = { title: "Edit Gear" };

export default async function ProviderGearEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Edit Gear"
        description="Update the details, pricing or availability of this listing."
      />
      <GearEditor gearId={id} />
    </div>
  );
}
