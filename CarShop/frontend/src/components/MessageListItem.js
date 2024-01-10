import React from 'react'


const MessageListItem = ({message}) => {
    const timestampString = message.timestamp;

    const timestamp = new Date(timestampString);

    const formattedTimestamp = timestamp.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'numeric',
        day: 'numeric',
    });
    return (
        <div className="message-list-item">
            <div style={{width : '100%'}}>
                <div style={{display : 'flex', flexDirection : 'row', justifyContent : 'space-between'}}>
                    <h3 style={{color : '#f68657'}}>{message.sender.email}</h3>
                    <h3 style={{color : '#1976d2'}}>{formattedTimestamp}</h3>
                </div>
                <h3>{message.content}</h3>
            </div>
        </div>
    )
}

export default MessageListItem