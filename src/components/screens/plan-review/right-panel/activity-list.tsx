import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ActivityList = () => {
  // Sample activity data
  const activities = [
    {
      id: 1,
      user: { name: "John Doe", avatar: "/avatars/john.jpg", initials: "JD" },
      action: "added a comment",
      target: "Section 3.2",
      date: "2 hours ago",
    },
    {
      id: 2,
      user: { name: "Jane Smith", avatar: "/avatars/jane.jpg", initials: "JS" },
      action: "uploaded",
      target: "revised-plans.pdf",
      date: "Yesterday",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        avatar: "/avatars/mike.jpg",
        initials: "MJ",
      },
      action: "approved",
      target: "electrical plans",
      date: "2 days ago",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">
                  {activity.user.name}
                </span>
                <span className="text-sm text-gray-700">
                  {" "}
                  {activity.action}{" "}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {activity.target}
                </span>
              </div>
              <span className="text-xs text-gray-500">{activity.date}</span>
            </div>
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No recent activity
        </p>
      )}
    </div>
  );
};
