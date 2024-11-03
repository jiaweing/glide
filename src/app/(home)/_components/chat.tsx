"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "staff"; content: string };

const staffResponses: string[] = [
  "Thank you for your message. How can I assist you today?",
  "I understand your concern. Let me check that for you.",
  "I'm sorry to hear that you're experiencing this issue. Let's see how we can resolve it.",
  "That's a great question. Here's what you need to know:",
  "I appreciate your patience. I'm looking into this matter right now.",
  "Is there anything else I can help you with?",
  "Thank you for bringing this to our attention. We'll make sure to address it.",
  "I'm glad I could help. Don't hesitate to reach out if you have any more questions.",
  "I apologize for any inconvenience this may have caused. Let's find a solution together.",
  "Your feedback is valuable to us. We'll use it to improve our services.",
];

const thankYouMessage =
  "Thank you for using our chat service. Is there anything else I can help you with before we end this conversation?";

export function Chat({ user }: { user: { email: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const sendMessage = () => {
    if (currentMessage.trim() === "") return;

    const newMessages = [...messages, { role: "user", content: currentMessage.trim() } as Message];
    setMessages(newMessages);
    setCurrentMessage("");

    // Simulate staff response
    setTimeout(() => {
      let staffResponse: string;
      if (messageCount === 0) {
        // If it's the last message before ending the chat
        staffResponse = thankYouMessage;
      } else {
        const randomIndex = Math.floor(Math.random() * staffResponses.length);
        staffResponse =
          staffResponses[randomIndex] ?? "I'm sorry, I don't have a response for that.";
      }
      setMessages([...newMessages, { role: "staff", content: staffResponse }]);
      setTimeout(() => {
        setMessageCount((prevCount) => prevCount + 1);
      }, 2000);
    }, 1000);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messageCount === 3) {
      setIsDrawerOpen(true);
      setIsChatEnded(true);
    }
  }, [messageCount]);

  return (
    <div className="flex h-full flex-col">
      <Drawer
        open={isDrawerOpen}
        onOpenChange={(state: boolean) => {
          setIsDrawerOpen(state);
          if (!state) {
            router.push("/help");
          }
        }}
      >
        <DrawerContent className="mx-auto max-w-xl">
          <div className="relative flex h-full flex-col items-center justify-center p-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => router.push("/help")}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mb-6 text-xl font-semibold">The live chat has ended</h3>
            <p className="mb-4 text-muted-foreground">Was your issue resolved?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="icon"
                  className="hover:text-yellow-400"
                  onClick={() => {
                    setRating(star);
                    setTimeout(() => setIsDrawerOpen(false), 500);
                  }}
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      {!isChatEnded ? (
        <>
          <ScrollArea className="h-[calc(100vh-12rem)]" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "staff" && (
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                className="flex-1"
                value={currentMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentMessage(e.target.value)
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <Button size="icon" variant="ghost" onClick={sendMessage}>
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
