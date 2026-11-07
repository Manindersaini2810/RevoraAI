import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      id: "m_1",
      sender: "ai",
      time: "Just now",
      text: "Hello! I am your Revora AI Recovery Agent. I continuously analyze failed transactions across Razorpay, evaluate customer payment histories, and recommend bounded recovery actions validated against your Policy Guardian rules.",
      chips: [
        "Why did UPI payments fail in the last 2 hours?",
        "What is our revenue at risk right now?",
        "Why was transaction txn_vikram_01 blocked by Policy Guardian?",
        "Analyze customer Priya Kapoor's payment history",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: "user",
      time: "Just now",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      let aiResponseText = "";
      const lower = query.toLowerCase();

      if (lower.includes("upi") || lower.includes("degradation") || lower.includes("rc-001")) {
        aiResponseText =
          "**UPI Incident RC-001 Detected:**\n\n- **Failure Rate Surge:** 68.4% across HDFC (@okhdfcbank) and SBI (@oksbi) UPI handles due to intermittent NPCI switch timeouts (latency >8,000ms).\n- **Transactions Impacted:** 142 transactions (Revenue at risk: ₹3,48,500.00).\n- **Recommended Strategy:** Dynamic fallback routing to ICICI UPI node and automated WhatsApp 1-click retry payment links.\n- **Policy Guardian Check:** Approved under autonomous batch limit (₹500 / txn limit waived for verified test cohort). 94 transactions already recovered (+₹2,31,000.00).";
      } else if (lower.includes("risk") || lower.includes("how much") || lower.includes("at risk")) {
        aiResponseText =
          "**Current Revenue at Risk Telemetry:**\n\n- **Active Revenue at Risk:** ₹8,98,900.00 across 395 failed attempts.\n- **Recovered to Date:** ₹4,43,000.00 (49.3% bounded recovery rate).\n- **Top Failure Cause:** NPCI Switch Timeouts (42%), Insufficient Funds (28%), Card Expiration (18%).\n- **Policy Safeguard:** 100% of payment retries adhere to the 3-attempt maximum limit.";
      } else if (lower.includes("vikram") || lower.includes("blocked")) {
        aiResponseText =
          "**Policy Guardian Intercept on txn_vikram_01 (Vikram Singh):**\n\n- **Amount:** ₹4,999.00\n- **Failure Reason:** DO_NOT_HONOR / Stolen Card Flag\n- **Customer Risk Level:** HIGH (Lifetime Value: ₹1,200)\n- **Decision:** The AI Agent proposed `STOP_INTERVENTION` and Policy Guardian issued `POLICY_BLOCKED`. Automated retry was strictly withheld to prevent chargeback liabilities.";
      } else if (lower.includes("priya")) {
        aiResponseText =
          "**Customer Profile Analysis: Priya Kapoor (cust_priya123):**\n\n- **Lifetime Value:** ₹95,000.00 (VIP / LOW Risk Profile)\n- **Recent Incident:** Mandate failed for ₹3,499.00 due to BANK_SERVER_OUTAGE.\n- **AI Action:** Dispatched personalized VIP WhatsApp payment link with priority fallback routing.\n- **Outcome:** Successfully recovered in 12 minutes without merchant human intervention.";
      } else {
        aiResponseText = `I have analyzed your query: "${query}". Based on current merchant telemetry, all recovery operations are active and governed by the Policy Guardian with ₹500 autonomous threshold and 3-attempt limit. Would you like me to inspect active risk cases or trigger a simulation run?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: "ai",
          time: "Just now",
          text: aiResponseText,
        },
      ]);
      setThinking(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
      {/* Assistant Header */}
      <div className="p-4 border-b border-border/80 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex items-center justify-center font-bold text-xs shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Revora AI Recovery Assistant
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                GPT-4o / Claude 3.5 Sonnet
              </span>
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Autonomous failure diagnosis &amp; bounded recovery execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Connected to Telemetry
          </span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950"
              }`}
            >
              {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-2xl rounded-xl p-3.5 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 rounded-tr-none font-medium"
                  : "bg-muted/50 border border-border/80 text-foreground rounded-tl-none space-y-3"
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Prompt Suggestion Chips */}
              {m.chips && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                  {m.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="px-2.5 py-1 rounded-md bg-background border border-border text-[11px] font-medium text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex items-center justify-center text-xs shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="rounded-xl p-3 bg-muted/40 border border-border text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin" />
              <span>Analyzing payment failure patterns and policy bounds...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-border/80 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about payment failures, customer risk scores, or recovery recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs bg-muted/40 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="p-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
