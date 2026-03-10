import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MemberAvatar({
  name,
  avatar,
  size = "sm",
  className,
}: {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)} title={name}>
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback className="bg-zinc-700 text-zinc-300 text-[0.65rem]">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
