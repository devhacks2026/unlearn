
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./index.css";

interface Message {
  id: number;
  role: "user" | "model";
  content: string;
  attachmentName?: string;
}

function App() {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  // Remove selected attachment
  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle message submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim() && !selectedFile) return;

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      attachmentName: selectedFile?.name,
    };

    setMessages((previous) => [...previous, newMessage]);

    setInput("");
    removeFile();
  };

  // Handle microphone input
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="chat-header">
        <div className="brand">
          <span className="sparkle">✦</span>
          <h1>Unlearn</h1>
        </div>
      </header>

      {/* Chat area */}
      <main className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <h2>Hello! What are you studying today?</h2>
            <p>
              Upload your notes, ask questions, and discover
              what you really understand.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message message--${message.role}`}
            >
              {message.content && <p>{message.content}</p>}

              {message.attachmentName && (
                <div className="message-attachment">
                  📄 {message.attachmentName}
                </div>
              )}
            </div>
          ))
        )}
      </main>

      {/* Input bar */}
      <footer className="input-wrapper">
        <form className="chat-form" onSubmit={handleSubmit}>

          {/* Selected file preview */}
          {selectedFile && (
            <div className="attachment-preview">
              <span>📄 {selectedFile.name}</span>

              <button
                type="button"
                className="remove-file-btn"
                onClick={removeFile}
                aria-label="Remove attachment"
              >
                ×
              </button>
            </div>
          )}

          <div className="input-row">

            {/* Hidden file selector */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              hidden
              onChange={handleFileChange}
            />

            {/* Attach button */}
            <button
              type="button"
              className="icon-btn attach-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach a file"
              aria-label="Attach a file"
            >
              +
            </button>

            {/* Text input */}
            <input
              type="text"
              className="user-input"
              placeholder="Ask a question or explore a concept..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoComplete="off"
            />
            <button
              type="button"
              className={`mic-btn ${isListening ? "listening" : ""}`}
              onClick={startListening}
              title="Use microphone"
              aria-label="Use microphone">
              🎙
            </button>

            {/* Send button */}
            <button
              type="submit"
              className="send-btn"
              disabled={!input.trim() && !selectedFile}
              aria-label="Send message"
              title="Send message"
            >
              ↑
            </button>

          </div>
        </form>

        <p className="input-disclaimer">
          Unlearn helps you identify gaps in your understanding.
        </p>
      </footer>

    </div>
  );
}

export default App;
