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
