import { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, MicIcon, ChevronDownIcon, SendHorizontal } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const dummyProjects = [
  { id: "sutter", name: "1112 Sutter Remodelling Project", date: "2025-07-30" },
  { id: "baker", name: "Baker Towers New Build", date: "2025-06-20" },
  { id: "hyde", name: "Hyde Street Commercial Revamp", date: "2025-05-10" },
];

export const Chatbot = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCody, setIsCody] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingCodyState, setPendingCodyState] = useState<boolean | null>(
    null,
  );
  const [isSwitchChecked, setSwitchChecked] = useState(!isCody);
  const [selectedProjectId, setSelectedProjectId] = useState(
    dummyProjects[0].id,
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setSwitchChecked(!isCody);
  }, [isCody]);

  useEffect(() => {
    [
      "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/cody3d.png",
      "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/human3d.png",
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    [
      "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/cody-to-human.mp4",
      "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/human-to-cody.mp4",
    ].forEach((src) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.src = src;
      video.load();
    });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (isAnimating && videoRef.current) {
      videoRef.current.playbackRate = 15.0;
      videoRef.current.play();
    }
  }, [isAnimating]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInput(e.target.value);
  };

  const handleCodyToggle = () => {
    if (isAnimating) return;
    setPendingCodyState(!isCody);
    setIsAnimating(true);
  };

  const handleAnimationEnd = () => {
    if (pendingCodyState !== null) {
      setIsCody(pendingCodyState);
      setPendingCodyState(null);
    }
    setIsAnimating(false);
  };

  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement>,
    messageContent?: string,
  ) => {
    if (e) e.preventDefault();
    const currentMessage = messageContent || input;
    if (!currentMessage.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    if (!messageContent) {
      setInput("");
    }

    if (!isCody) {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "We'll get back to you soon. Average response time is 15 minutes.",
          },
        ]);
      }, 500);
      return;
    }

    setIsLoading(true);
    const assistantMessageId = (Date.now() + 1).toString();
    setChatMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...chatMessages
              .filter((m) => m.id !== assistantMessageId)
              .map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: currentMessage },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let message = `Error: ${errorData.details || response.statusText}`;
        if (response.status === 401) {
          message =
            "Invalid API key: You can find your API key at https://platform.openai.com/account/api-keys";
        }
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: message } : msg,
          ),
        );
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulatedResponse += decoder.decode(value, { stream: true });
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedResponse }
              : msg,
          ),
        );
      }
      accumulatedResponse += decoder.decode();
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: accumulatedResponse }
            : msg,
        ),
      );
    } catch (error) {
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `Error: ${
                  error instanceof Error
                    ? error.message
                    : "Failed to fetch response"
                }`,
              }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "user",
            content: `File uploaded: ${file.name}`,
          },
        ]);
      }
    };
    input.click();
  };

  const sampleQuestions = [
    "What are the AHJs I'm working with right now?",
    "Do I need to submit a structural report for the Westwood project?",
    "Draft a pre-review package for the Vallejo solar installation.",
    "Which AHJs do i need to talk to and what is their contact info?",
  ];

  const handleSampleQuestionClick = (question: string) => {
    setInput("");
    handleSubmit(undefined, question);
  };

  const selectedProject = dummyProjects.find(
    (p) => p.id === selectedProjectId,
  )!;
  const posterSrc = isCody
    ? "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/cody3d.png"
    : "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/human3d.png";
  const videoSrc = isCody
    ? "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/cody-to-human.mp4"
    : "https://rescope-demo.sfo3.cdn.digitaloceanspaces.com/chatbot/human-to-cody.mp4";

  return (
    <div className="h-full flex flex-col p-0 gap-0">
      <div className="flex-1 flex flex-col p-0 overflow-hidden">
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="w-full justify-between border-b border-t-0 border-x-0  rounded-none px-3 py-1 h-auto text-sm bg-muted [&>svg]:hidden focus-visible:ring-0 focus-visible:border-muted">
            <div className="flex w-full items-center justify-between">
              <span className="text-gray-500 text-xs mr-2">
                {selectedProject.date}
              </span>
              <span className="font-medium text-sm truncate">
                {selectedProject.name}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500 ml-2 shrink-0" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-sm shadow-xs">
            {dummyProjects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div
          className={cn(
            "flex-1 flex flex-col",
            chatMessages.length === 0 && "items-center justify-center gap-3",
          )}
        >
          {chatMessages.length === 0 ? (
            <>
              <div className="flex flex-col items-center justify-between h-full px-3 py-3">
                <div className="flex flex-col items-center justify-center flex-grow">
                  <div
                    id="cody-animation-container"
                    className="w-40 h-40 mb-2 flex items-center justify-center"
                  >
                    <video
                      ref={videoRef}
                      key={isCody ? "cody" : "human"}
                      className="w-full h-full object-contain"
                      poster={posterSrc}
                      src={videoSrc}
                      muted
                      playsInline
                      onEnded={handleAnimationEnd}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label
                      htmlFor="cody-toggle"
                      className={cn(
                        "text-sm font-normal text-gray-600",
                        !isSwitchChecked
                          ? "text-gray-700 font-medium"
                          : "text-gray-500",
                      )}
                    >
                      Talk to Cody
                    </Label>
                    <Switch
                      id="cody-toggle"
                      checked={isSwitchChecked}
                      onCheckedChange={(checked) => {
                        setSwitchChecked(checked);
                        handleCodyToggle();
                      }}
                      className="mr-3 cursor-pointer rounded-sm data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-800 [&_[data-slot='switch-thumb']]:rounded-sm [&_[data-slot='switch-thumb']]:duration-100 [&_[data-slot='switch-thumb']]:delay-0 h-[24px] w-10 [&_[data-slot='switch-thumb']]:shadow-xl px-0.5 [&_[data-slot='switch-thumb']]:size-4.5"
                    />
                    <Label
                      htmlFor="cody-toggle"
                      className={cn(
                        "text-sm font-normal text-gray-600",
                        isSwitchChecked
                          ? "text-gray-700 font-medium"
                          : "text-gray-500",
                      )}
                    >
                      Talk to a human
                    </Label>
                  </div>

                  <div className="flex flex-col gap-3 items-center justify-center text-center px-4 pt-10">
                    <div className="mb-4 max-w-sm">
                      {isCody ? (
                        <p className="text-sm font-medium text-gray-800 leading-relaxed">
                          Cody is Rescope's AI code compliance assistant. <br />
                          By default, Cody has access to data from the current
                          screen, your construction documents and regulations.
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-gray-800 leading-relaxed">
                          Chat with a Rescope permit technician or plan reviewer
                          who can help with complex edge cases, nuanced
                          interpretations, or anything Cody isn't sure about.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {sampleQuestions.map((q, index) => (
                    <Card
                      key={index}
                      onClick={() => handleSampleQuestionClick(q)}
                      className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200/80 transition-colors h-full flex rounded-sm shadow-xs gap-0 py-3 items-center justify-center"
                      data-testid={`sample-question-card-${index}`}
                    >
                      <CardContent className="flex items-center justify-center text-center">
                        <p className="text-sm font-medium text-gray-800 leading-snug">
                          {q}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div
              className="overflow-y-auto flex-1 w-full flex flex-col justify-end px-3 pt-1"
              ref={chatContainerRef}
              data-testid="chat-message-list"
            >
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-1 text-[13px] py-1.5 px-2 leading-normal max-w-[75%] w-fit whitespace-pre-wrap rounded-md ${
                    m.role === "user"
                      ? "bg-blue-100 text-blue-800 ml-auto"
                      : "bg-gray-100 text-gray-800 mr-auto"
                  }`}
                >
                  {m.role === "assistant" && m.content === "" && isLoading ? (
                    <span className="italic">Thinking...</span>
                  ) : (
                    m.content
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 px-3 items-center py-2 border-t border-gray-200">
          <Switch
            id="footer-cody-toggle"
            checked={isSwitchChecked}
            onCheckedChange={(checked) => {
              setSwitchChecked(checked);
              handleCodyToggle();
            }}
            className="mr-3 cursor-pointer rounded-sm data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-800 [&_[data-slot='switch-thumb']]:rounded-sm [&_[data-slot='switch-thumb']]:duration-100 [&_[data-slot='switch-thumb']]:delay-0 h-[24px] w-10 [&_[data-slot='switch-thumb']]:shadow-lg px-0.5 [&_[data-slot='switch-thumb']]:size-4.5"
          />
          <button onClick={handleUpload}>
            <Upload className="h-5 w-5 text-gray-600" />
          </button>
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 items-center mx-1 min-w-0"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={
                isCody
                  ? "Ask Cody a question..."
                  : "Ask our human expert a question..."
              }
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 min-w-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(undefined, input);
                }
              }}
              disabled={isLoading}
            />
            {input.trim() ? (
              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white h-8 w-8 p-0 ml-2"
                disabled={isLoading}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-gray-900 hover:bg-gray-800 text-white h-8 w-8 p-0 ml-2"
                disabled={isLoading}
                onClick={() => {
                  /* microphone functionality placeholder */
                }}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
