"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

type ChatMessage = {
  id: number;
  text: string;
  fromMe: boolean;
  time: string;
};

type Thread = {
  id: number;
  name: string;
  project: string;
  unread: number;
  messages: ChatMessage[];
};

const demoThreads: Thread[] = [
  {
    id: 1,
    name: "Олексій (Frontend)",
    project: "Landing для SaaS",
    unread: 1,
    messages: [
      { id: 1, text: "Доброго дня, можете подивитись макет?", fromMe: false, time: "10:12" },
      { id: 2, text: "Так, вже дивлюсь. Напишу фідбек за 30 хв.", fromMe: true, time: "10:14" },
      { id: 3, text: "Супер, дякую!", fromMe: false, time: "10:15" },
    ],
  },
  {
    id: 2,
    name: "Марія (UI/UX)",
    project: "Мобільний застосунок",
    unread: 0,
    messages: [
      { id: 1, text: "Оновила прототип в Figma.", fromMe: false, time: "09:02" },
      { id: 2, text: "Прийняв, перевірю сьогодні.", fromMe: true, time: "09:18" },
    ],
  },
];

export default function MessagesPage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>(demoThreads);
  const [activeThreadId, setActiveThreadId] = useState<number>(demoThreads[0]?.id ?? 0);
  const [draft, setDraft] = useState("");

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId),
    [threads, activeThreadId]
  );

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSend = () => {
    if (!activeThread || !draft.trim()) return;
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: Date.now(),
                  text: draft.trim(),
                  fromMe: true,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ],
            }
          : thread
      )
    );
    setDraft("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container py-6 md:py-8 px-4 flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 md:gap-6 h-[min(72vh,760px)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Переписка клієнта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 overflow-y-auto max-h-[70vh]">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    activeThreadId === thread.id ? "bg-accent border-primary/40" : "hover:bg-accent/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{thread.name}</p>
                    {thread.unread > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-500 text-white text-xs h-5 min-w-5 px-1">
                        {thread.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{thread.project}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-base">
                {activeThread ? `${activeThread.name} • ${activeThread.project}` : "Оберіть діалог"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeThread?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${
                      message.fromMe
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-[11px] opacity-70 mt-1">{message.time}</p>
                  </div>
                ))}
              </div>
              <div className="border-t p-3 flex gap-2">
                <Input
                  placeholder="Напишіть повідомлення..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                />
                <Button onClick={handleSend}>Надіслати</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
