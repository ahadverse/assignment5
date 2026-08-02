import { PageHeader } from "@/components/dashboard/page-header";
import { GearCreator } from "@/components/provider/gear-creator";

export const metadata = { title: "Add Gear" };

export default function ProviderGearNewPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Add Gear"
        description="List a new piece of equipment. It goes live in the catalogue straight away."
      />
      <GearCreator />
    </div>
  );
}
