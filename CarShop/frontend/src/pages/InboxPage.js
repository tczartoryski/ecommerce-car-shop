import React, {useState, useEffect} from "react";
import { request} from "../authentication";
import ConversationListItem from "../components/ConversationListItem";

const InboxPage = () => {
    let [conversations, setConversations] = useState([])
    let getConversations = async () => {
        let response = await request('/api/conversations', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let data = await response.json();
        setConversations(data)
    }

    useEffect(() => {
        getConversations()
    }, [])
    return (
        <div className="notes">
            <div className="notes-header">
                <h2 className="notes-title">&#9782; Inbox</h2>
                <p className="notes-count">{conversations.length}</p>
            </div>
            <div className="notes-list">
                {conversations.map((conversation, index) => (
                    <div>
                        <ConversationListItem conversation={conversation}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default InboxPage