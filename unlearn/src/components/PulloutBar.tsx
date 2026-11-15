import { useState } from 'react'
import './PulloutBar.css'
import type { Concept } from "../types/study";

interface PulloutBarProps {
  concepts: Concept[];
}

function PulloutBar({ concepts }: PulloutBarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <>
            <button
                id="openSidebar"
                onClick={() => setIsSidebarOpen(true)}
                className="open-sidebar"
            >
                View Topics
            </button>

            <aside
                id="sidebar"
                className={`right-sidebar ${isSidebarOpen ? 'right-sidebar-open' : ''}`}
            >
                <button
                    id="closeSidebar"
                    onClick={() => setIsSidebarOpen(false)}
                    className="close-sidebar"
                >
                    X
                </button>

                <h2 className="sidebar-heading">Topics</h2>

                <div id="topicList" className="topic-list">
                    {concepts.length === 0 ? (
                        <p className="empty-topics">
                            No concepts assessed yet. Start chatting to discover what you know!
                        </p>
                    ) : (
                        concepts.map((concept) => (
                        <div key={concept.id} className="topic">
                            <span>{concept.name}</span>

                            <span
                                className={`progress-circle ${concept.status}`}
                                title={concept.explanation ?? concept.status}
                                aria-label={`${concept.name}: ${concept.status}`}
                            />
                        </div>
                        ))
                    )}
                </div>
            </aside>
        </>
    )
}

export default PulloutBar
