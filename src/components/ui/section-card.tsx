import * as React from "react";

import { cn } from "@/lib/utils";

function SectionCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-3 rounded-lg border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function SectionCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-center px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] border-b py-2",
        className,
      )}
      {...props}
    />
  );
}

function SectionCardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        // TODO: improve the text color
        "leading-none font-semibold text-card-foreground/70 py-1.5 my-auto",
        className,
      )}
      {...props}
    />
  );
}

function SectionCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm sr-only", className)}
      {...props}
    />
  );
}

function SectionCardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function SectionCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-3 h-full grow", className)}
      {...props}
    />
  );
}

function SectionCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  SectionCard,
  SectionCardHeader,
  SectionCardFooter,
  SectionCardTitle,
  SectionCardAction,
  SectionCardDescription,
  SectionCardContent,
};
