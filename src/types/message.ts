type DetectedObject = {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
};

export type Message = {
  id: string;
  originalImage: File;
  user: string;
  assistant: string | null;
  calculation: string | null;
  detectedObjects: DetectedObject[];
  createdAt: Date;
  feedback: "positive" | "negative" | null;
  type: "chat" | "specs";
};
