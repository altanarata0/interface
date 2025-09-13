import * as React from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface IndividualStatsCardItemProps {
  title: React.ReactNode; // Changed from string to React.ReactNode
  description: string;
  className?: string;
}

/**
 * Renders an individual statistic item as a Card.
 */
export function IndividualStatsCard({
  title,
  description,
  className,
}: IndividualStatsCardItemProps) {
  //TODO: get mx-auto or equivalent to work
  return (
    <Card
      className={cn("p-3 bg-muted w-fit mx-auto gap-1.5 rounded-sm", className)}
    >
      <CardHeader className="p-0 gap-0">
        <CardTitle className="text-sm font-semibold">{description}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-lg font-semibold tabular-nums">{title}</div>
      </CardContent>
    </Card>
  );
}
