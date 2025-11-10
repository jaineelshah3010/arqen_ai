"use client";

import { useState, useEffect, useRef } from "react";
import { Montserrat, Quicksand, Red_Hat_Display, Unbounded } from 'next/font/google'
import { PlusIcon } from "lucide-react";
import { ArrowUpIcon, ChatBubbleOvalLeftIcon, FolderOpenIcon, LinkIcon, MagnifyingGlassIcon, PhotoIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";


function TaskItem({ task }: { task: string }) {
  const [done, setDone] = useState(false);
  return (
    <li className="flex items-center gap-2">
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={done}
        onChange={() => setDone(true)}
        disabled={done}
      />
      <span
        className={`text-sm ${done ? "line-through text-gray-400" : ""}`}
      >
        {task}
      </span>
    </li>
  );
}

const unbounded = Unbounded({
  subsets: ['latin']
})

const montserrat = Montserrat({
  subsets: ['latin']
})


const red_hat = Red_Hat_Display({
  subsets: ['latin'],
})


const quicksand = Quicksand({
  weight: '500',
  subsets: ['latin'],
})

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string; sources?: string[]; points?: string[] }[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const [isThinking, setIsThinking] = useState(false);
  const [displayedReply, setDisplayedReply] = useState("");

  const greetings = [
    "I’m here if you need me — what’s on your mind?",
    "What should we work on together today?",
    "Anything you’d like me to dive into for you?",
    "Need a hand with something? I’ve got you.",
    "Let’s get started — what do you want to tackle first?"
  ];

  const [greetingPrompt, setGreetingPrompt] = useState("");

  useEffect(() => {
    setGreetingPrompt(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchChats() {
      if (isSignedIn) {
        const res = await fetch("/api/chats");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      }
    }
    fetchChats();
  }, [isSignedIn]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    setIsThinking(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        style: "casual",
        history: chatHistory, // include history so backend can remember
      }),
    });
    const data = await res.json();
    setIsThinking(false);
    setDisplayedReply("");
    let fullReply = data.summary || "";

    // If the AI didn't provide a reply, fallback
    if (!fullReply.trim()) {
      fullReply = "Sorry, I didn't catch that.";
    }

    // Define thresholds
    const isIntense = fullReply.length > 250; 
    if (isIntense) {
      setIsThinking(true);
      // Show "thinking..." for 1.5s before typing
      setTimeout(() => {
        setIsThinking(false);
        let i = 0;
        const interval = setInterval(() => {
          setDisplayedReply(fullReply.slice(0, i + 1));
          i++;
          if (i >= fullReply.length) {
            clearInterval(interval);
            setChatHistory((prev) => [
              ...prev,
              { role: "assistant", content: fullReply, sources: data.sources, points: data.points }
            ]);
            setDisplayedReply("");
          }
        }, 15); // faster typing speed
      }, 1500);
    } else {
      // No "thinking" for short/simple responses
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedReply(fullReply.slice(0, i + 1));
        i++;
        if (i >= fullReply.length) {
          clearInterval(interval);
          setChatHistory((prev) => [
            ...prev,
            { role: "assistant", content: fullReply, sources: data.sources, points: data.points }
          ]);
          setDisplayedReply("");
        }
      }, 20); // normal typing speed
    }
    setMessage("");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Hello";
  };

  return (
    <>
      <div className={`flex min-h-screen bg-white`}>
        {/* Left sidebar (icons) */}
        
        {/* Header */}
        <div className="flex flex-1 flex-col pl-20">
          <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-12 py-5 border-b border-gray-300 bg-white z-50">
            <div className="flex items-center gap-6">
              <span className={`text-lg text-black flex gap-5 ${unbounded.className}`}>ArqenA.I.</span>
             <button className={`flex items-center gap-2 text-sm px-4 py-2 font-semibold border border-dotted border-gray-400 text-[#151515] bg-white rounded-xl ${red_hat.className}`}>
                <ChatBubbleOvalLeftIcon className="w-5 h-5 text-black" />
                <span>Model 1.0</span>
              </button>
            </div>
            <div className={`tracking-wide text-lg text-gray-700 font-light ${red_hat.className}`}>
              + Collection 
             <span className={`text-lg text-[#1B3C53] font-semibold`}> / New file</span>
            </div>
            <div className="flex items-center gap-4">
              
              <button className={`flex items-center gap-2 text-sm px-4 py-2 font-semibold border border-dotted border-gray-400 bg-white text-[#151515] rounded-xl ${red_hat.className}`}> 
                  <UserPlusIcon className="w-5 h-5 text-black" />
                  <span>Invite</span>
                </button>
                <button className={`flex items-center gap-2 text-sm px-4 py-2 font-semibold border border-gray-400 text-[#151515] bg-white rounded-xl ${red_hat.className}`}>
                  <MagnifyingGlassIcon className="w-5 h-5 text-black" />
                  <span>Search thread</span>
                </button>
                <button className={`flex items-center gap-2 text-sm px-4 py-2 font-semibold border bg-[#151515] text-white rounded-xl ${red_hat.className}`}> 
                  <PlusIcon className="w-5 h-5 text-white" />
                  <span>New thread</span>
                </button>
              
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12",
                    },
                  }}
                  showName={false}
                />
              ) : (
                <SignInButton mode="modal">
                  <button className="text-sm px-4 py-2 bg-[#1B3C53] text-white rounded-lg">
                    Sign in
                  </button>
                </SignInButton>
              )}
            </div>
          </header>
          {/* Main content and right sidebar */}
          <div className="flex flex-1">
            <main className="flex-1 max-w-3xl mx-auto pt-28">
              {chatHistory.length > 0 && (
                <>
                  {/* AI reply display */}
                  <div className="flex flex-col gap-4 mb-24">
                    {chatHistory.map((chat, idx) => (
                      chat.role === "assistant" ? (
                        <div key={idx} className="flex justify-start w-[36rem]">
                          <div className="flex flex-col gap-6 w-full">
                            <div className="rounded-2xl p-6 bg-white space-y-4">
                              {chat.content && (
                                <p className={`text-gray-800 leading-relaxed text-base ${red_hat.className}`}>{chat.content}</p>
                              )}
                              {chat.points && chat.points.length > 0 && (
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {chat.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                  ))}
                                </ul>
                              )}
                              {chat.sources && chat.sources.length > 0 && (
                                <div className="mt-4">
                                  <h3 className={`font-semibold mb-2 ${red_hat.className}`}>🔗 Sources</h3>
                                  <div className="flex gap-2 flex-wrap">
                                    {chat.sources.map((src, i) => (
                                      <a
                                        key={i}
                                        href={src}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 border rounded-lg text-sm text-blue-600 hover:bg-gray-50"
                                      >
                                        {src}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={idx} className="flex justify-end w-[36rem]">
                          <div className="bg-[#1B3C53] text-white border p-4 rounded-2xl w-fit max-w-full">
                            <p className={`text-sm ${red_hat.className}`}>{chat.content}</p>
                          </div>
                        </div>
                      )
                    ))}
                    {isThinking && !displayedReply && (
                      <div className="flex justify-start w-[36rem]">
                        <div className="flex flex-col gap-6 w-full">
                          <div className="rounded-2xl p-4 bg-gray-50 border text-gray-500 text-sm italic">
                            Thinking...
                          </div>
                        </div>
                      </div>
                    )}
                    {displayedReply && (
                      <div className="flex justify-start w-[36rem]">
                        <div className="flex flex-col gap-6 w-full">
                          <div className="rounded-2xl p-6 bg-white space-y-4">
                            <p className={`text-gray-800 leading-relaxed text-base ${red_hat.className}`}>{displayedReply}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </>
              )}
              {chatHistory.length === 0 && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-[36rem] flex flex-col items-center text-center">
                    <motion.div
  className="w-32 h-32 rounded-full mb-6"
  style={{
    background: "radial-gradient(circle at 30% 30%, #3B82F6, #1D4ED8, #1E3A8A)",
    boxShadow: `
      0 0 60px rgba(59, 130, 246, 0.8),   /* stronger outer glow */
      inset 0 0 50px rgba(59, 130, 246, 0.6), /* inner blue glow */
      inset 0 0 30px rgba(255,255,255,0.5)    /* brighter inner shine */
    `,
    backgroundSize: "300% 300%",  // larger so movement is more noticeable
  }}
  animate={{
    borderRadius: "50%",
    scale: [1, 1.1, 0.95, 1.05, 1],
    rotate: [0, 15, -15, 5, 0],      // add small extra twist
    backgroundPosition: [
      "20% 20%",
      "80% 30%",
      "30% 80%",
      "70% 70%",
      "20% 20%"
    ],
    backgroundSize: [
      "300% 300%",
      "320% 320%",
      "280% 280%",
      "300% 300%",
      "300% 300%"
    ],
  }}
  transition={{
    repeat: Infinity,
    duration: 12,
    ease: "easeInOut",
  }}
/>
                    <h1 className={`text-4xl font-bold text-gray-900 mb-2 ${montserrat.className}`}>
                      {getGreeting()}, {user?.firstName || "User"}
                    </h1>
                    <p className="text-xl text-gray-600">
                      {greetingPrompt}
                    </p>
                  </div>
                </div>
              )}
              {/* Fixed bottom search/ask AI bar */}
              <div className="fixed bottom-10 inset-x-0 flex justify-center text-black">
                <div className="flex items-center gap-3 bg-white border border-[#000957] rounded-3xl shadow-lg px-4 py-2 w-[36rem]">
                   <MagnifyingGlassIcon className="w-6 h-6 text-black" />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isSignedIn) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={isSignedIn ? "Ask or search for anything use" : "Sign in to ask questions..."}
                    disabled={!isSignedIn}
                    className="flex-1 px-3 py-2 text-base focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed bg-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!isSignedIn}
                    className={`w-10 h-10 flex items-center justify-center rounded-full shadow ${red_hat.className} ${
                      isSignedIn ? "bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ArrowUpIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </main>
            <aside className="w-fit px-7 p-7 flex flex-col gap-6 text-black fixed right-0 top-20 bg-white h-fit">
              <div className="border border-gray-300 rounded-2xl p-6 bg-white flex flex-col flex-1">
                <h2 className="font-semibold mb-4">Sources</h2>
                <div className="flex flex-col items-center justify-center gap-3 border-2 border-dotted border-gray-400 rounded-xl mb-4 py-10 hover:bg-gray-50 cursor-pointer">
                  <FolderOpenIcon className="w-14 h-14 text-gray-600" />
                  <p className={`text-sm text-gray-700 font-semibold ${red_hat.className}`}>Drag or drop your file</p>
                </div>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Add from connected knowledge or upload to thread.
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
                    <LinkIcon className="w-5 h-5 text-gray-700" />
                    Upload file
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
                    <PhotoIcon className="w-5 h-5 text-gray-700" />
                    Upload media
                  </button>
                </div>
                 <p className="text-sm font-bold text-gray-500 pt-3 text-center">
                  @ Browse existing content
                </p>
              </div>
               <div className="border border-gray-300 rounded-2xl p-6 bg-white flex flex-col h-fit">
                <h2 className="font-semibold mb-4">Suggested tasks</h2>
                {[
                  
                ].map((task, idx) => (
                  <TaskItem key={idx} task={task} />
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}