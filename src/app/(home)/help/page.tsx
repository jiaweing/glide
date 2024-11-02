"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronDown, ChevronUp, Image as ImageIcon, Star, X } from "lucide-react";
import { useState } from "react";

type Screen = "help" | "chat" | "ended";
type FAQ = { question: string; answer: string };

export default function Component() {
  const [screen, setScreen] = useState<Screen>("help");
  const [messages, setMessages] = useState([
    { role: "user", content: "The bus is not moving" },
    { role: "staff", content: "Ok, let me check the status" },
    {
      role: "staff",
      content:
        "The bus is delayed due to an accident around the area. It will reach your location soon. Any other queries?",
    },
    { role: "user", content: "No." },
    { role: "staff", content: "Okay thank you. I will end the chat." },
  ]);
  const [rating, setRating] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "How do I book a shuttle?",
      answer:
        "To book a shuttle, open the app, enter your pickup and drop-off locations, select your preferred time, and confirm your booking. The app will assign you to the nearest available autonomous shuttle.",
    },
    {
      question: "What if the shuttle is late?",
      answer:
        "Our autonomous shuttles are designed to be punctual. However, if there's a delay due to unforeseen circumstances, you'll receive a notification in the app with an updated arrival time. You can also track your shuttle in real-time within the app.",
    },
    {
      question: "How do I cancel a booking?",
      answer:
        "To cancel a booking, go to 'My Trips' in the app, select the booking you wish to cancel, and tap on 'Cancel Booking'. Please note that cancellations made less than 5 minutes before the scheduled pickup may incur a small fee.",
    },
    {
      question: "Is it safe to ride in an autonomous shuttle?",
      answer:
        "Yes, our autonomous shuttles are equipped with advanced safety features and undergo regular maintenance. They use state-of-the-art sensors and AI to navigate safely. In the rare event of an issue, our remote monitoring team can take control of the vehicle.",
    },
    {
      question: "What if I leave something in the shuttle?",
      answer:
        "If you've left an item in the shuttle, please report it immediately through the 'Lost & Found' section in the app. Provide details about the item and your trip. Our team will check the shuttle and contact you if the item is found.",
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col">
        {screen === "help" && (
          <div className="flex h-full flex-col p-4">
            <div className="mb-6 flex items-center gap-2">
              <div>
                <h1 className="text-xl font-semibold">Help Center</h1>
                <p className="text-sm text-muted-foreground">Frequently Asked Questions</p>
              </div>
            </div>
            <div className="mb-6">
              <Input type="search" placeholder="Search for issues" className="w-full" />
            </div>
            <ScrollArea className="flex-1">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-2">
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-between px-4 py-3 font-normal"
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  >
                    <span className="text-left">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <ChevronUp className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    )}
                  </Button>
                  {expandedFAQ === index && (
                    <div className="mt-1 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
            <div className="mt-auto border-t pt-6">
              <Button
                onClick={() => setScreen("chat")}
                className="flex h-auto w-full items-center gap-3 p-4"
                variant="outline"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Still need help?</div>
                  <div className="text-sm text-muted-foreground">
                    Seek assistance from our Live Chat!
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {screen === "chat" && (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b p-4">
              <Button variant="ghost" size="icon" onClick={() => setScreen("help")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold">Live Chat</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
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
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button size="icon" variant="ghost">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {screen === "ended" && (
          <div className="relative flex h-full flex-col items-center justify-center p-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setScreen("help")}
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
                  onClick={() => setRating(star)}
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
        )}
      </div>
    </div>
  );
}
