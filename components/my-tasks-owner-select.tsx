"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/components/member-avatar";

type Member = {
  id: string;
  name: string;
  avatar: string | null;
};

export function MyTasksOwnerSelect({
  members,
  currentId,
}: {
  members: Member[];
  currentId: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(memberId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("user", memberId);
    router.push(`/my-tasks?${params.toString()}`);
  }

  return (
    <Select value={currentId ?? undefined} onValueChange={handleChange}>
      <SelectTrigger className="w-[220px] border-zinc-700 bg-zinc-900">
        <SelectValue placeholder="Sélectionner un profil" />
      </SelectTrigger>
      <SelectContent>
        {members.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            <div className="flex items-center gap-2">
              <MemberAvatar name={m.name} avatar={m.avatar} size="sm" />
              <span>{m.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
