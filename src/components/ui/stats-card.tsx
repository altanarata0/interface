import { cn } from "@/lib/utils";
import { Card } from "./card";

export interface StatsCardProps {
  items: { title: string; description: string }[];
}

/**
 * Renders a **single** gradient Card that displays up to five stats items.
 *
 * – Uses a `flex` layout that fills the available width (`w-full`).
 * – Shows the first three items on small screens; the 4th & 5th appear from the
 *   `md` breakpoint upward.
 */
export function StatsCard({ items }: StatsCardProps) {
  // keep max 5 items, as requested
  const displayItems = items.slice(0, 5);

  return (
    <Card className="w-full p-4 shadow-xs bg-muted rounded-sm">
      <div className="grid grid-cols-3 xl:grid-cols-5 w-full justify-between gap-4">
        {displayItems.map((item, i) => (
          <div
            key={`${item.description}${i}`}
            className={cn(
              "@container/card flex flex-col flex-1 text-center",
              i > 2 && "hidden md:flex",
            )}
          >
            <span className="text-sm text-muted-foreground">
              {item.description}
            </span>
            <span className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
