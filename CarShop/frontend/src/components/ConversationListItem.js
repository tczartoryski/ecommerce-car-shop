import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import {getUserId} from "../authentication";


const ConversationListItem = ({conversation}) => {
    const [from, setFrom ] = useState(null)
    const myUserId = getUserId();
    useEffect(() => {
        if (myUserId == conversation?.buyer?.id) {
            setFrom(conversation?.seller?.email)
        }
        else {
            setFrom(conversation?.buyer?.email)
        }
    })
    const car = conversation.car
    return (
        <Link to={`/conversation/${conversation.id}`}>
            <div className="notes-list-item">
                <div>
                    <h3>Conversation With: {from}</h3>
                </div>
                <div style={{whiteSpace : 'nowrap'}}>
                    <h3>{car.year} {car.make} {car.model}</h3>
                    <h3>{car.price} {car.location}</h3>
                </div>
            </div>
        </Link>
    )
}

export default ConversationListItem