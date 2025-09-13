import * as React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

export interface SectionCardDashboardData {
  title: string;
  value: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
}

interface SectionCardsDashboardProps {
  cards: SectionCardDashboardData[];
}

export function SectionCardsDashboard({ cards }: SectionCardsDashboardProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 w-full max-w-full box-border overflow-hidden
                sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-4
                *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card 
                dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t 
                *:data-[slot=card]:shadow-xs"
    >
      {cards.map((card, idx) => (
        <Card key={idx} className="@container/card min-w-0 ">
          <CardHeader>
            {card.description && (
              <CardDescription>{card.description}</CardDescription>
            )}
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            {card.badge && <CardAction>{card.badge}</CardAction>}
          </CardHeader>
          {card.footer && (
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              {card.footer}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
