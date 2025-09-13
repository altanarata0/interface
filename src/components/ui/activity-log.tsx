import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Separator } from "./separator";
import { Dot } from "lucide-react";

export interface ActivityLogItemProps {
  id: string;
  avatarSrc?: string;
  avatarFallback: string;
  activity: string;
  name: string;
  date: string; // For simplicity, using string. Can be Date and formatted.
}

export interface ActivityLogProps {
  items: ActivityLogItemProps[];
  className?: string;
}

export function ActivityLog({ items, className }: ActivityLogProps) {
  if (!items || items.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        No activity to display.
      </p>
    );
  }

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <li className="space-y-1.5">
            <p className=" font-medium text-foreground">{item.activity}</p>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                {item.avatarSrc && (
                  <AvatarImage src={item.avatarSrc} alt={item.name} />
                )}
                <AvatarFallback className="text-sm">
                  {item.avatarFallback}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground flex items-center">
                <span className="font-medium">{item.name}</span>
                <Dot className="w-4 h-4 mx-0.5 stroke-2" />
                {item.date}
              </p>
            </div>
          </li>
          {index < items.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </ul>
  );
}
