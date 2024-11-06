"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type FAQ = { question: string; answer: string };

export function Help({ user }: { user: { email: string } }) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const faqs: FAQ[] = [
    {
      question: "How do I book a shuttle?",
      answer:
        "To book a shuttle, open the app, enter your pickup and drop-off locations, select your preferred time, and confirm your booking. The app will assign you to the nearest available autonomous shuttle.",
    },
    {
      question: "Can I change my dropoff destination?",
      answer:
        "Yes, you can change your dropoff destination before the shuttle arrives. Tap on the destination on the booking screen and enter your new dropoff location. Please note that you can only change the dropoff destination once.",
    },
    {
      question: "How do I cancel a booking?",
      answer:
        "To cancel a booking, tap on 'Cancel Booking' on a booking screen. Please note that you can only cancel before the bus arrives.",
    },
    {
      question: "Is it safe to ride in an autonomous shuttle?",
      answer:
        "Yes, our autonomous shuttles are equipped with advanced safety features and undergo regular maintenance. They use state-of-the-art sensors and AI to navigate safely. In the rare event of an issue, our remote monitoring team can take control of the vehicle.",
    },
  ];

  const filteredFAQs = useMemo(() => {
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Help Center</h1>
          <p className="text-muted-foreground">Frequently Asked Questions</p>
        </div>
      </div>
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search for issues.."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1">
        {filteredFAQs.map((faq, index) => (
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
      <div className="mt-auto pt-6">
        <Button
          onClick={() => router.push("/chat")}
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
              Start a Live Chat with our support team!
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
