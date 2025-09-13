import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { BellIcon } from "lucide-react";

export function Notifications() {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  // Placeholder data - in a real app, this would come from props or a store
  const notifications = [
    { id: "1", text: "New message from Jane Doe" },
    { id: "2", text: "Project 'Alpha' has been updated" },
    { id: "3", text: "You have 3 new tasks assigned" },
    { id: "4", text: "Mike mentioned you in a comment" },
    {
      id: "5",
      text: "A new file 'blueprint_v3.pdf' was uploaded to 'Project Beta'",
    },
  ];

  return (
    <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <BellIcon className="size-5 text-muted-foreground hover:text-foreground" />
          {notifications.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <div className="p-2 font-medium text-sm border-b">Notifications</div>
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start"
            >
              <div className="py-2 hover:bg-accent rounded-md w-full">
                <p className="text-sm">
                  {notification.text.slice(0, 1).toUpperCase() +
                    notification.text.slice(1)}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
        {/* <DropdownMenuItem className="border-t justify-center text-sm text-blue-600 hover:!text-blue-700 cursor-pointer"> */}
        {/*   View all notifications */}
        {/* </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
