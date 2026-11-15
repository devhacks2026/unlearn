import { useState } from 'react'
import './PulloutBar.css'
import type { Concept } from "../types/study";

interface PulloutBarProps {
  concepts: Concept[];
}

function PulloutBar({ concepts }: PulloutBarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // clicking into topics will reveal explanation behind the assessment
    const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

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
                            <div key={concept.id} className="topic-container">
                                <button
                                    type="button"
                                    className="topic"
                                    onClick={() =>
                                        setSelectedConceptId(
                                            // if student clicks already-selected concept, close explanation
                                            // otherwise open the clicked concept color explanation
                                            selectedConceptId === concept.id ? null : concept.id
                                        )
                                    }
                                    aria-expanded={selectedConceptId === concept.id}
                                >
                                <span>{concept.name}</span>

                                <span
                                    className={`progress-circle ${concept.status}`}
                                    aria-hidden="true"
                                />
                                </button>

                                {selectedConceptId === concept.id && (
                                <p className="topic-explanation">
                                    {concept.explanation || "No explanation available yet."}
                                </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </>
    )
}

export default PulloutBar
