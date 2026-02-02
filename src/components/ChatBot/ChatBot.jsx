import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { sendChatMessage } from "../../services/api";
import useLocationStore from "../../store/useLocationStore";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    const nextHistory = [...history, userMessage];
    setHistory(nextHistory);
    setMessage("");
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const locationId = selectedLocation?.locationId;

      const response = await sendChatMessage({
        userId: userId ? parseInt(userId) : null,
        locationId: locationId ? parseInt(locationId) : null,
        userMessage: message,
        history: nextHistory.slice(-10), // Send last 10 messages for context
      });

      const assistantMessage = {
        role: "assistant",
        content: response.response,
      };
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      {!isOpen ? (
        <div className="chatbot-collapsed-icon" onClick={() => setIsOpen(true)}>
          <span className="icon">🎮</span>
        </div>
      ) : (
        <>
          <div className="chatbot-header" onClick={() => setIsOpen(false)}>
            <span>🎮 Game Assistant</span>
            <button className="toggle-btn">−</button>
          </div>

          <div className="chatbot-body">
            <div className="messages-container">
              {history.length === 0 && (
                <div className="welcome-msg">
                  Hi! Ask me about games, availability, or your bookings.
                </div>
              )}
              {history.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="message-content">
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                        components={{
                          a: ({ href, children, ...props }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer noopener"
                              {...props}
                            >
                              {children}
                            </a>
                          ),
                          code: ({ inline, className, children, ...props }) => {
                            const text = String(children ?? "").replace(
                              /\n$/,
                              ""
                            );
                            if (inline) {
                              return (
                                <code
                                  className={`inline-code ${
                                    className ?? ""
                                  }`.trim()}
                                  {...props}
                                >
                                  {text}
                                </code>
                              );
                            }
                            return (
                              <pre className="code-block">
                                <code className={className} {...props}>
                                  {text}
                                </code>
                              </pre>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant loading">Typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSend}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                Send
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;
