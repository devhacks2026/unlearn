
import { useRef, useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

import type { Message } from "./types/study";

import {
  getChannels,
  createChannel,
  getMessages,
} from "./services/storage";

import { sendStudyMessage } from "./services/studySession";

import "./index.css";

function App() {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // use React's useState to remember the current channel ID
  // lazy initiation used (calls initializer when setting up component than recalculating result on every render)
  const [channelId] = useState<string>(() => {
    // retrieve the channels saved in localStorage
    const existingChannels = getChannels();

    // if at least one exists, use the id of the first channel
    if (existingChannels.length > 0) {
      return existingChannels[0].id;
    }

    // otherwise, create a new channel and return its id
    const newChannel = createChannel(
      "General Study",
      "My first Unlearn study session"
    );

    return newChannel.id;
  });

  // load saved messages for the current channel
  // aka start with messages that were previously saved to localStorage
  const [messages, setMessages] = useState<Message[]>(
    () => getMessages(channelId)
  );

  // track whether gemini is responding
  // use this state to disable send button while request is in progress (no spamming! >:))
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

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
  const handleSubmit = async(
    event: SubmitEvent<HTMLFormElement>
  ) => {
    // prevent browser from executing its default build-in action
    event.preventDefault();

    const text = input.trim();

    // prevent empty messages or overlapping requests
    if (!text || isSending) {
      return;
    }
    
    // file upload isn't connected to gemini yet
    if (selectedFile) {
      setError("File uploads aren't supported yet! Remove the file to send the text.");
      return;
    }

    // indicate that a message is being sent
    setIsSending(true);
    // clear any previous error message
    setError("");
    // clear the input field
    setInput("");

    try {
      // send message to gemini and save both messages
      const request = sendStudyMessage(channelId, text);

      // service synchronously saves user's message to localStorage before await
      setMessages(getMessages(channelId));

      // wait for gemini to finish responding
      await request;

      // reload conversation with gemini's response
      setMessages(getMessages(channelId));

      // purpose of above code is so that student's input is immediately displayed
      // while gemini continues to think
    } catch (error) {
      console.error("Failed to send message: ", error);

      // user's message may already have been saved to localStorage
      setMessages(getMessages(channelId));

      setError("Gemini couldn't respond. Please try again. Sorry! :(");
    } finally {
      // indicate that sending is complete
      setIsSending(false);
    }
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
          // goes through each message in array
          // creates a react element for it (each a bubble)
          messages.map((message) => (
            <div
              // key distinguishes between elements in a list
              key={message.id}
              className={`message message--${
                // if message from gemini, use model
                // otherwise, use user
                message.role === "assistant" ? "model" : "user"
              }`}
            >
              {message.content && <p>{message.content}</p>}
            </div>
          ))
        )}

        {/* conditional rendering for the "thinking" message */}
        {isSending && (
          <div className="message message--model message--pending">
            Unlearn is thinking...
          </div>
        )}

        {/* display errors in chat */}
        {error && (
          // role="alert" helps screen readers announce the error message
          <div className="message message--error" role="alert">
            {error}
          </div>
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
              // make sure to disable button while gemini responds
              disabled={
                isSending ||
                !input.trim() ||
                selectedFile !== null
              }
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
