import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";

export default function NotFound() {
  return (
    <div>
      <PageHero
        title="Not found"
        description="We couldn't find what you were looking for."
      />

      <Card className="p-10 text-center">
        <div className="font-display text-6xl text-muted-foreground">404</div>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
          The page or record may have been removed, or you might be looking at it
          from the wrong studio.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/clients">
              <ArrowLeft /> Back to clients
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
