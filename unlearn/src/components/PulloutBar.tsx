
import { useState } from 'react'
import './PulloutBar.css'

function PulloutBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const topics = [
        { name: "Topic #1", status: "not-covered" },
        { name: "Topic #2", status: "not-covered" },
        { name: "Topic #3", status: "not-covered" },
        { name: "Topic #4", status: "not-covered" }
    ]

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
                className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}
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
                    {topics.map((topic, index) => (
                        <div key={index} className="topic">
                            <span>{topic.name}</span>
                            <span className={`progress-circle ${topic.status}`}></span>
                        </div>
                    ))}
                </div>
            </aside>
        </>
    )
}

export default PulloutBar
