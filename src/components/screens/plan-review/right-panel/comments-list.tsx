import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CommentsList = () => {
  // Sample comments data
  const comments = [
    {
      id: 1,
      user: { name: "John Doe", avatar: "/avatars/john.jpg", initials: "JD" },
      text: "This section needs to be revised to comply with code requirements.",
      date: "2 hours ago",
    },
    {
      id: 2,
      user: { name: "Jane Smith", avatar: "/avatars/jane.jpg", initials: "JS" },
      text: "I've added notes about the structural calculations needed.",
      date: "Yesterday",
    },
  ];

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
            <AvatarFallback>{comment.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{comment.user.name}</p>
              <span className="text-xs text-gray-500">{comment.date}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No comments yet
        </p>
      )}
    </div>
  );
};
