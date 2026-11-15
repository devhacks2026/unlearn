import { useState } from "react";
import type { Channel } from "../../types/study";

// typescript interface describing left sidebar aspects
interface LeftSidebarProps {
    channels: Channel[];
    // which channel the user is currently on
    activeChannelId: string;
    // function called someone selects a channel
    onSelectChannel: (id: string) => void;
    // functionc called when someone creates new subject channel
    onCreateChannel: () => void;
    // whether subject actions should be temporarily disabled
    disabled?: boolean;
}

export default function LeftSidebar({
    channels,
    activeChannelId,
    onSelectChannel,
    onCreateChannel,
    disabled = false,
}: LeftSidebarProps) {
    // state for when sidebar is open or closed
    const [isOpen, setIsOpen] = useState(true);

    return (
        // add collapsed CSS class when sidebar is closed
        <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
            <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                aria-expanded={isOpen}
            >
                {isOpen ? "←" : "→"}
            </button>

            {isOpen && (
                <div className="sidebar-content">
                    <h1 className="logo">Unlearn</h1>

                    <button
                        type="button"
                        className="nav-item"
                        onClick={onCreateChannel}
                        disabled={disabled}
                    >
                        + New subject
                    </button>

                    <div className="subjects">
                        <p className="menu-label">YOUR SUBJECTS</p>

                        {/* display all subject channels */}
                        {channels.map((channel) => (
                            <button
                                key={channel.id}
                                type="button"
                                disabled={disabled}
                                className={`nav-item ${
                                    channel.id === activeChannelId ? "active" : ""
                                }`}
                                onClick={() => onSelectChannel(channel.id)}
                            >
                                {channel.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}