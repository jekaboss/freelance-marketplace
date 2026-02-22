"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { setUserScopedItem } from "@/lib/user-storage";
import { Trash2Icon } from "lucide-react";

type Role = "client" | "freelancer" | "admin";

type Participant = {
  id: number;
  name: string;
  role: Role;
};

type ChatMessage = {
  id: number;
  text: string;
  senderId: number;
  senderName: string;
  createdAt: string;
};

type Thread = {
  id: number;
  project: string;
  participants: [Participant, Participant];
  unreadBy: Record<string, number>;
  messages: ChatMessage[];
};

const CHAT_STORAGE_KEY = "chatThreads:v1";
const MENTIONS_STORAGE_KEY = "mentions:v1";

function getThreadsFromStorage(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Обробка @mentions в тексті повідомлення
function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex) || [];
  return matches.map(m => m.substring(1).toLowerCase()); // Видаляємо @ і переводимо в lowercase
}

// Зберігання нотісу про @mention
function saveMention(mentionedUsername: string, fromUser: Participant, messageText: string, threadId: number) {
  if (typeof window === "undefined") return;
  try {
    const key = `${MENTIONS_STORAGE_KEY}:${mentionedUsername}`;
    const existing = localStorage.getItem(key);
    const mentions = existing ? JSON.parse(existing) : [];
    
    mentions.push({
      id: Date.now(),
      from: fromUser.name,
      fromId: fromUser.id,
      message: messageText.substring(0, 100), // Перші 100 символів
      threadId,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    // Зберігаємо останні 20 mention-ів
    localStorage.setItem(key, JSON.stringify(mentions.slice(-20)));
  } catch (err) {
    console.error("Error saving mention:", err);
  }
}

// Отримання mention-ів для користувача
function getMentionsForUser(username: string) {
  if (typeof window === "undefined") return [];
  try {
    const key = `${MENTIONS_STORAGE_KEY}:${username.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveThreadsToStorage(threads: Thread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(threads));
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}

function getUnreadTotalForUser(threads: Thread[], userId: number): number {
  return threads
    .filter((thread) => thread.participants.some((p) => p.id === userId))
    .reduce((sum, thread) => sum + (thread.unreadBy[String(userId)] || 0), 0);
}

export default function MessagesPage() {
  const { isAuthenticated, isHydrated, user } = useAuth();
  const router = useRouter();

  const currentUser = useMemo<Participant | null>(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.fullName || user.email || `User #${user.id}`,
      role: user.role,
    };
  }, [user]);

  const [allThreads, setAllThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<number>(0);
  const [draft, setDraft] = useState("");
  // autocomplete for @mentions
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionSuggestions, setMentionSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeMentionsTab, setActiveMentionsTab] = useState(false);
  const [mentions, setMentions] = useState<any[]>([]);

  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [incomingNotice, setIncomingNotice] = useState<{ threadId: number; from: string; count: number } | null>(null);

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !currentUser) return;
    setAllThreads(getThreadsFromStorage());
    
    // Завантажуємо mentions для поточного користувача
    const userMentions = getMentionsForUser(currentUser.name.split(" ")[0].toLowerCase());
    setMentions(userMentions);
  }, [isHydrated, isAuthenticated, currentUser]);

  // Коли користувач відкриває вкладку mentions, ставимо всі як прочитані
  useEffect(() => {
    if (activeMentionsTab && currentUser) {
      const username = currentUser.name.split(" ")[0].toLowerCase();
      const updated = mentions.map((m) => ({ ...m, read: true }));
      setMentions(updated);
      try {
        localStorage.setItem(`${MENTIONS_STORAGE_KEY}:${username}`, JSON.stringify(updated));
      } catch {}
    }
  }, [activeMentionsTab, currentUser, mentions]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !currentUser || typeof window === "undefined") return;

    const refreshFromStorage = () => {
      const nextThreads = getThreadsFromStorage();
      setAllThreads((prevThreads) => {
        const prevMap = new Map(prevThreads.map((thread) => [thread.id, thread]));
        let nextNotice: { threadId: number; from: string; count: number } | null = null;

        for (const thread of nextThreads) {
          if (!thread.participants.some((p) => p.id === currentUser.id)) continue;

          const prevUnread = prevMap.get(thread.id)?.unreadBy?.[String(currentUser.id)] || 0;
          const nextUnread = thread.unreadBy?.[String(currentUser.id)] || 0;
          const unreadIncrease = nextUnread - prevUnread;

          if (unreadIncrease > 0 && thread.id !== activeThreadId) {
            const other = thread.participants.find((p) => p.id !== currentUser.id);
            nextNotice = {
              threadId: thread.id,
              from: other?.name || "Користувач",
              count: unreadIncrease,
            };
          }
        }

        if (nextNotice) {
          setIncomingNotice(nextNotice);
        }

        return nextThreads;
      });
    };

    refreshFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === CHAT_STORAGE_KEY) {
        refreshFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    const intervalId = window.setInterval(refreshFromStorage, 1500);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(intervalId);
    };
  }, [isHydrated, isAuthenticated, currentUser, activeThreadId]);

  const myThreads = useMemo(() => {
    if (!currentUser) return [];
    return allThreads
      .filter((thread) => thread.participants.some((p) => p.id === currentUser.id))
      .sort((a, b) => {
        const aTime = a.messages[a.messages.length - 1]?.createdAt || "";
        const bTime = b.messages[b.messages.length - 1]?.createdAt || "";
        return bTime.localeCompare(aTime);
      });
  }, [allThreads, currentUser]);

  useEffect(() => {
    if (!myThreads.length) {
      setActiveThreadId(0);
      return;
    }
    if (!myThreads.some((t) => t.id === activeThreadId)) {
      setActiveThreadId(myThreads[0].id);
    }
  }, [myThreads, activeThreadId]);

  const activeThread = useMemo(
    () => myThreads.find((thread) => thread.id === activeThreadId) || null,
    [myThreads, activeThreadId]
  );

  useEffect(() => {
    if (incomingNotice && incomingNotice.threadId === activeThreadId) {
      setIncomingNotice(null);
    }
  }, [incomingNotice, activeThreadId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages.length, scrollToBottom]);

  useEffect(() => {
    if (!activeThread || !currentUser) return;
    const currentUnread = activeThread.unreadBy[String(currentUser.id)] || 0;
    if (currentUnread === 0) return;

    const updated = allThreads.map((thread) =>
      thread.id === activeThread.id
        ? { ...thread, unreadBy: { ...thread.unreadBy, [String(currentUser.id)]: 0 } }
        : thread
    );
    setAllThreads(updated);
    saveThreadsToStorage(updated);
  }, [activeThread, currentUser, allThreads]);

  useEffect(() => {
    if (!currentUser) return;
    const totalUnread = myThreads.reduce(
      (sum, thread) => sum + (thread.unreadBy[String(currentUser.id)] || 0),
      0
    );
    setUserScopedItem("unreadMessagesCount", String(totalUnread), currentUser.id);
  }, [myThreads, currentUser]);

  if (!isHydrated) return null;
  if (!isAuthenticated || !currentUser) return null;

  const getOtherParticipant = (thread: Thread): Participant => {
    return thread.participants[0].id === currentUser.id ? thread.participants[1] : thread.participants[0];
  };

  const deleteThread = (threadId: number) => {
    if (typeof window === "undefined") return;
    const updated = allThreads.filter((t) => t.id !== threadId);
    setAllThreads(updated);
    saveThreadsToStorage(updated);
    if (activeThreadId === threadId) {
      setActiveThreadId(0);
    }
  };

  const createThread = () => {
    setCreateError(null);
    const parsedId = Number(partnerId);

    if (!partnerId || Number.isNaN(parsedId) || parsedId <= 0) {
      setCreateError("Вкажи коректний ID співрозмовника");
      return;
    }
    if (parsedId === currentUser.id) {
      setCreateError("Не можна створити чат із самим собою");
      return;
    }
    if (!partnerName.trim()) {
      setCreateError("Вкажи ім'я співрозмовника");
      return;
    }
    if (!projectName.trim()) {
      setCreateError("Вкажи назву проєкту");
      return;
    }

    const partnerRole: Role = currentUser.role === "client" ? "freelancer" : "client";
    const newThread: Thread = {
      id: Date.now(),
      project: projectName.trim(),
      participants: [
        currentUser,
        { id: parsedId, name: partnerName.trim(), role: partnerRole },
      ],
      unreadBy: { [String(currentUser.id)]: 0, [String(parsedId)]: 0 },
      messages: [],
    };

    const updated = [newThread, ...allThreads];
    setAllThreads(updated);
    saveThreadsToStorage(updated);
    setActiveThreadId(newThread.id);
    setPartnerId("");
    setPartnerName("");
    setProjectName("");
  };

  const sendMessage = () => {
    if (!activeThread || !draft.trim()) return;
    const text = draft.trim();
    const other = getOtherParticipant(activeThread);


    // Виявляємо @mentions у повідомленні
    const mentions = extractMentions(text);
    // (збережемо нотіси після формування оновленого списку тредів,
    // щоб у випадку створення нового треду була правильна threadId)

    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      senderId: currentUser.id,
      senderName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    // зчитуємо всі existing учасники
    const allParticipants = allThreads.flatMap((t) => t.participants);
    // structure для згаданих користувачів
    type Mentioned = { id: number; name: string };
    const mentionedList: Mentioned[] = [];

    mentions.forEach((mention) => {
      // шукаємо існуючого
      let mentionedUser = allParticipants.find(
        (p) =>
          p.name.toLowerCase().includes(mention) ||
          mention.toLowerCase().includes(p.name.toLowerCase())
      );
      if (!mentionedUser) {
        // створимо «фейкового» користувача
        mentionedUser = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: mention,
          role: "freelancer",
        } as Participant;
      }
      if (mentionedUser.id !== currentUser.id) {
        mentionedList.push({ id: mentionedUser.id, name: mentionedUser.name });
      }
    });

    let updated = allThreads.map((thread) => {
      // основний поточний чат
      if (thread.id === activeThread.id) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          unreadBy: {
            ...thread.unreadBy,
            [String(currentUser.id)]: 0,
            [String(other.id)]: (thread.unreadBy[String(other.id)] || 0) + 1,
          },
        };
      }
      // якщо в іншому чаті присутній згаданий користувач
      const participantIds = thread.participants.map((p) => p.id);
      const intersect = mentionedList
        .map((m) => m.id)
        .filter((id) => participantIds.includes(id));
      if (intersect.length > 0) {
        const targetId = intersect[0];
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          unreadBy: {
            ...thread.unreadBy,
            [String(targetId)]: (thread.unreadBy[String(targetId)] || 0) + 1,
          },
        };
      }
      return thread;
    });

    // створюємо нові треди для будь-яких згаданих, які ще не мають
    mentionedList.forEach((m) => {
      const exists = updated.some(
        (t) =>
          t.participants.some((p) => p.id === m.id) &&
          t.participants.some((p) => p.id === currentUser.id)
      );
      if (!exists) {
        const newThread: Thread = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          project: `@mention`,
          participants: [currentUser, { id: m.id, name: m.name, role: "freelancer" }],
          unreadBy: {
            [String(m.id)]: 1,
          },
          messages: [newMessage],
        };
        updated = [...updated, newThread];
      }
    });

    // після оновлення списку тредів зберігаємо згадки у localStorage
    mentions.forEach((mention) => {
      // шукаємо тред, де ми та згаданий користувач
      const thread = updated.find((t) =>
        t.participants.some((p) => p.id === currentUser.id) &&
        t.participants.some((p) =>
          p.name.toLowerCase().includes(mention) ||
          mention.toLowerCase().includes(p.name.toLowerCase())
        )
      );
      if (thread) {
        const mentionedParticipant = thread.participants.find(
          (p) =>
            p.id !== currentUser.id &&
            (p.name.toLowerCase().includes(mention) ||
              mention.toLowerCase().includes(p.name.toLowerCase()))
        );
        if (mentionedParticipant) {
          saveMention(
            mentionedParticipant.name.split(" ")[0].toLowerCase(),
            currentUser,
            text,
            thread.id
          );
        }
      }
    });

    setAllThreads(updated);
    saveThreadsToStorage(updated);
    setUserScopedItem("unreadMessagesCount", String(getUnreadTotalForUser(updated, currentUser.id)), currentUser.id);
    setUserScopedItem("unreadMessagesCount", String(getUnreadTotalForUser(updated, other.id)), other.id);
    setDraft("");
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container py-6 md:py-8 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 md:gap-6 h-[min(78vh,820px)]">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Переписка</CardTitle>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant={!activeMentionsTab ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveMentionsTab(false)}
                >
                  Чати
                </Button>
                <Button 
                  variant={activeMentionsTab ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveMentionsTab(true)}
                >
                  @Згадки {mentions.length > 0 && `(${mentions.filter(m => !m.read).length})`}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 overflow-y-auto flex-1">
              {activeMentionsTab ? (
                // Вкладка з @mentions
                <div className="space-y-2">
                  {mentions.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">Ніхто вас ще не згадав</p>
                  ) : (
                    mentions.map((mention) => (
                      <div
                        key={mention.id}
                        onClick={() => {
                          setActiveMentionsTab(false);
                          setActiveThreadId(mention.threadId);
                        }}
                        className="p-3 rounded-md border bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 cursor-pointer transition-colors text-sm"
                      >
                        <p className="font-medium text-amber-900 dark:text-amber-100">
                          @{mention.from}
                        </p>
                        <p className="text-xs text-amber-800 dark:text-amber-200 mt-1 line-clamp-2">
                          {mention.message}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                          {formatTime(mention.timestamp)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
              // Вкладка з чатами
              <>
              {incomingNotice && (
                <div className="p-2 rounded-md border border-green-500/50 bg-green-500/10 text-xs text-green-700 dark:text-green-400">
                  Нове повідомлення від {incomingNotice.from}
                  {incomingNotice.count > 1 ? ` (+${incomingNotice.count})` : ""}.
                  <button
                    type="button"
                    className="ml-2 underline"
                    onClick={() => setActiveThreadId(incomingNotice.threadId)}
                  >
                    Відкрити чат
                  </button>
                </div>
              )}
            </>
          )}

          <div className="space-y-2 p-2 border rounded-md">
            <p className="text-xs text-muted-foreground">Новий діалог client ↔ freelancer</p>
            <Input
              placeholder="ID співрозмовника"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
            />
            <Input
              placeholder="Ім'я співрозмовника"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
            />
            <Input
              placeholder="Проєкт"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            {createError && <p className="text-xs text-red-500">{createError}</p>}
            <Button className="w-full" onClick={createThread}>Створити чат</Button>
          </div>

              {myThreads.map((thread) => {
                const other = getOtherParticipant(thread);
                const unread = thread.unreadBy[String(currentUser.id)] || 0;
                return (
                  <div
                    key={thread.id}
                    className="group flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`flex-1 text-left p-3 rounded-md border transition-colors ${
                        activeThreadId === thread.id ? "bg-accent border-primary/40" : "hover:bg-accent/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{other.name}</p>
                        {unread > 0 && (
                          <span className="inline-flex items-center justify-center rounded-full bg-green-500 text-white text-xs h-5 min-w-5 px-1">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {thread.project} • {other.role}
                      </p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                      title="Видалити чат"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-base">
                {activeThread
                  ? `${getOtherParticipant(activeThread).name} • ${activeThread.project}`
                  : "Оберіть або створіть діалог"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-350px)]">
                {!activeThread && (
                  <p className="text-sm text-muted-foreground">Немає активного діалогу</p>
                )}
                {activeThread?.messages.map((message) => {
                  const fromMe = message.senderId === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${
                        fromMe ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-[11px] opacity-70 mt-1">{formatTime(message.createdAt)}</p>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-3 flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Напишіть повідомлення..."
                    value={draft}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDraft(v);
                      // autocomplete logic while typing
                      const queryMatch = v.match(/@(\w*)$/);
                      const query = queryMatch ? queryMatch[1].toLowerCase() : null;
                      if (query !== null && activeThread) {
                        setMentionQuery(query);
                        const participants = activeThread.participants.map((p) => p.name.split(" ")[0].toLowerCase());
                        const suggestions = participants.filter(
                          (name) => name.startsWith(query) && name !== currentUser.name.split(" ")[0].toLowerCase()
                        );
                        setMentionSuggestions(suggestions);
                        setShowSuggestions(suggestions.length > 0);
                      } else {
                        setShowSuggestions(false);
                        setMentionQuery(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (showSuggestions && mentionSuggestions.length) {
                          // вставити першу підказку
                          const name = mentionSuggestions[0];
                          setDraft(draft.replace(/@(\w*)$/, `@${name} `));
                          setShowSuggestions(false);
                          return;
                        }
                        sendMessage();
                      }
                    }}
                    disabled={!activeThread}
                  />
                  {showSuggestions && mentionSuggestions.length > 0 && (
                    <div className="absolute bottom-full left-0 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10">
                      {mentionSuggestions.map((s) => (
                        <div
                          key={s}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setDraft(draft.replace(/@(\w*)$/, `@${s} `));
                            setShowSuggestions(false);
                          }}
                        >
                          @{s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={sendMessage} disabled={!activeThread || !draft.trim()}>
                  Надіслати
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
