import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import SendWelcomeButton from "./SendWelcomeButton";

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await db.clients.findById(id);
  if (!client) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
      <p className="mt-1 text-sm text-zinc-500">Client profile</p>

      <div className="mt-6 bg-white border border-zinc-200 rounded p-5">
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Client ID</dt>
            <dd className="font-mono">{client.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Email</dt>
            <dd>{client.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Joined</dt>
            <dd>{new Date(client.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <SendWelcomeButton clientId={client.id} />
      </div>
    </div>
  );
}
