// main react component named App
import PulloutBar from './components/PulloutBar'
import './App.css'
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { Message, Concept } from "./types/study";
import LeftSidebar from "./components/layout/LeftSidebar";

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
    
  // load all existing channels, or create a default one
  const [channels, setChannels] = useState(() => {
    const existingChannels = getChannels();

    if (existingChannels.length > 0) {
      return existingChannels;
    }

    const newChannel = createChannel(
      "General Study",
      "My first Unlearn study session"
    );

    return [newChannel];
  });

  // track which channel the student is currently viewing
  // setChannelId will allow us to change which subject is selected
  const [channelId, setChannelId] = useState<string>(
    () => channels[0].id
  );

  // load saved messages for the current channel
  // aka start with messages that were previously saved to localStorage
  const [messages, setMessages] = useState<Message[]>(
    () => getMessages(channelId)
  );

  // create react state containing array of concepts
  const [concepts, setConcepts] = useState<Concept[]>(
    // load saved channels from localStorage
    () => getChannels().find(
      (channel) => channel.id === channelId
    )?.concepts ?? []                                   // use empty array if no matching channel found
  );

  // track whether gemini is responding
  // use this state to disable send button while request is in progress (no spamming! >:))
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // useRef creates react reference object
  // <HTMLElement> says that reference points to HTML element
  // null means that it doesn't point to an element yet
  const chatMessagesRef = useRef<HTMLElement>(null);

  // react hook that runs after the component has rendered
  // want scrolling code to run after react updates component
  // prevent user from having to scroll manually themselves
  useEffect(() => {
    // .current property gives access to actual HTML element
    const chatContainer = chatMessagesRef.current;

    // if the chat element exists
    if (chatContainer) {
      // scrollTop - container's current vertical scroll position
      // scrollHeight - total height of its content
      // tells browser to scroll as far down as possible
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, isSending]);      // dependency array - rerun effect when either value changes

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

      // load Gemini's latest concept assessments in topics bar
      const updatedChannel = getChannels().find(
        (channel) => channel.id === channelId
      );

      // update react state --> re-render when concepts state changes
      setConcepts(updatedChannel?.concepts ?? []);
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

  // left sidebar - switch to an existing study channel
  const handleSelectChannel = (id: string) => {
    // don't switch channels while gemini is responding
    if (isSending) {
      return;
    }

    // make sure the selected channel exists
    const channelExists = channels.some(
      (channel) => channel.id === id
    );

    if (!channelExists) {
      return;
    }

    // update the active channel
    setChannelId(id);

    // load its saved chat history
    setMessages(getMessages(id));

    const selectedChannel = getChannels().find(
      (channel) => channel.id === id
    );

    setConcepts(selectedChannel?.concepts ?? []);

    // clear the previous channel's input and errors
    setInput("");
    setError("");
  };

  // create a new study channel
  const handleCreateChannel = () => {
    if (isSending) {
      return;
    }

    // ask student for a subject name
    const name = window.prompt("Enter a subject name:");

    // stop if they cancel or enter an empty name
    if (!name || !name.trim()) {
      return;
    }

    // ask for an optional description
    const description = window.prompt(
      "Describe what you're studying (optional):"
    ) ?? "";

    // create and save the channel to localStorage
    const newChannel = createChannel(name, description);

    // reload the sidebar's subject list
    setChannels(getChannels());

    // automatically switch to the newly created channel
    setChannelId(newChannel.id);

    // new channels have empty conversation histories and concepts
    setMessages([]);
    setConcepts([]);

    // clear input and errors
    setInput("");
    setError("");
  };

  return (
    <div className="layout">
      <LeftSidebar
        channels={channels}
        activeChannelId={channelId}
        onSelectChannel={handleSelectChannel}
        onCreateChannel={handleCreateChannel}
        disabled={isSending}
      />

      {/* react prop --> send concepts state from App into component */}
      <PulloutBar concepts={concepts}/>

    <div className="app-container">

      {/* Header */}
      <header className="chat-header">
        <div className="brand">
          <span className="sparkle">✦</span>
          <h1>{channels.find((channel) => channel.id === channelId)?.name ?? "Unlearn"}</h1>
        </div>
      </header>

      {/* Chat area */}
      {/* adding ref in main tells react to store reference to this HTML element in chatMessagesRef */}
      <main className="chat-messages" ref={chatMessagesRef}>
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-icon">✎</div>

            <h2>Let's uncover what you really know.</h2>

            <p>
              Pick a concept and explain it in your own words.
              Unlearn will ask thoughtful questions, uncover
              knowledge gaps, and track your understanding.
            </p>

            <p className="welcome-hint">
              Try: "I think covalent bonds transfer electrons."
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
    </div>
  );
}

{/* make component available to other files by exporting */}
export default App;