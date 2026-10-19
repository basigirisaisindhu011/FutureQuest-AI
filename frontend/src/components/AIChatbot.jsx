import React, { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import api from "../utils/api";
import { QuestyMascot } from "./QuestyMascot";
export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi, I’m Questy! Ask me about coding, nature, stories or your next adventure.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const end = useRef(null);
  const launcher = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, loading]);
  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };
  const send = async (event) => {
    event.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMessages((previous) => [...previous, { sender: "user", text }]);
    setLoading(true);
    try {
      const response = await api.post("/ai/chat", { message: text });
      setMessages((previous) => [
        ...previous,
        { sender: "ai", text: response.data.response },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: "I couldn’t reach the adventure server. Please try again when you’re connected. You can still browse the game collection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <aside className={`chat-widget ${open ? "chat-widget--open" : ""}`} aria-label="Questy adventure guide">
      {open ? (
        <section
          className="chat-panel"
          aria-label="Chat with Questy"
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
        >
          <header className="chat-header">
            <span>
              <QuestyMascot
                className="chat-questy"
                expression={loading ? "thinking" : "happy"}
              />{" "}
              Ask Questy
            </span>
            <button
              className="icon-button"
              aria-label="Close Questy chat"
              onClick={close}
            >
              <X size={19} />
            </button>
          </header>
          <div
            className="chat-messages"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <p
                className={`chat-message chat-message--${message.sender}`}
                key={index}
              >
                <span className="sr-only">
                  {message.sender === "user" ? "You: " : "Questy: "}
                </span>
                {message.text}
              </p>
            ))}
            {loading && (
              <p className="fine-print" role="status">
                Questy is thinking…
              </p>
            )}
            <span ref={end} />
          </div>
          <div className="chat-suggestions">
            {[
              "Tell me about coding",
              "What about nature?",
              "Suggest an adventure",
            ].map((text) => (
              <button key={text} onClick={() => setInput(text)}>
                {text}
              </button>
            ))}
          </div>
          <form className="chat-form" onSubmit={send}>
            <label htmlFor="questy-message" className="sr-only">
              Message to Questy
            </label>
            <input
              id="questy-message"
              className="form-input"
              placeholder="What are you curious about?"
              autoFocus
              value={input}
              maxLength={1000}
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              className="btn btn-primary"
              aria-label="Send message"
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
          <p className="chat-disclaimer">
            A rule-based guide. Suggestions are not an assessment.
          </p>
        </section>
      ) : (
        <button
          ref={launcher}
          className="chat-launcher"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label="Ask Questy"
        >
          <QuestyMascot className="chat-questy" />
          Ask Questy
        </button>
      )}
    </aside>
  );
}
