import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import NewClientForm from "./NewClientForm";

export default function NewClientPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/clients">
            <ArrowLeft /> All clients
          </Link>
        </Button>
      </div>
      <PageHero title="New client" />
      <NewClientForm />
    </div>
  );
}
