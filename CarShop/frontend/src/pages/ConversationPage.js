import React, { useLayoutEffect, useState} from "react"
import { useNavigate, useParams} from "react-router-dom";
import {ReactComponent as ArrowLeft} from '../assets/arrow-left.svg'
import Button from "@mui/material/Button";
import { request} from "../authentication";
import MessageListItem from "../components/MessageListItem";
import TextField from "@mui/material/TextField";

const textFieldContainerStyles = {
    display: 'flex',
    flexDirection: 'column', // Updated to stack items vertically
    width: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'var(--color-white)',
};

const textFieldStyles = {
    marginBottom: '8px', // Add margin to separate TextField and Button
};


const ConversationPage = () => {
    let [chatBox, setChatBox] = useState('')
    let [messages, setMessages] = useState([]);
    let [carId, setCarId] = useState(null)
    const navigate = useNavigate();
    const {id} = useParams();

    let getMessages = async () => {
        let response = await request(`/api/conversation/${id}/`, {headers: {
                'Content-Type': 'application/json',
            },});
        let data = await response.json();
        setMessages(data);
        setCarId(data[0].conversation?.car?.id)
    }

    const handleChange = (event) => {
        const { value } = event.target;
        setChatBox(value)
    }

    const handleSend = async () => {
        setChatBox('')
        let response = await request(`/api/conversation/${id}/`, {
            method : 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: chatBox }),
        });
        let data = await response.json();
        setMessages(data);
        setCarId(data[0].conversation?.car?.id)

    }

    const handleNavigateCar = () => {
        navigate(`/car/${carId}`)
    }
    const handleGoBack = () => {
        navigate(-1);
    };
    useLayoutEffect(() => {
        getMessages()

    }, [])


    return (
        <div className="note" style={{flex: 1, display : 'flex', flexDirection: 'column', overflow: 'auto'}}>
            <div className="note-header">
                <div>
                    <Button onClick={handleGoBack}>
                        <ArrowLeft/>
                    </Button>
                </div>
                <Button onClick={handleNavigateCar}>TAKE ME TO CAR</Button>
            </div>
            <div className="notes" style={{flex : 1}} >
                <div className="message-list">
                    {messages.map((message, index) => (
                        <MessageListItem message={message}/>
                    ))}
                </div>
            </div>
            <div style={textFieldContainerStyles}>
                <TextField
                    required
                    onChange={handleChange}
                    fullWidth
                    value={chatBox}
                    style={textFieldStyles}
                    name="chat"
                    type="chat"
                    id="chat"
                    InputProps={{
                        style: {color : 'var(--color-text)'},
                    }}
                />
                <Button style={{ width: '100%' }} onClick={handleSend}>Send Chat</Button>
            </div>
        </div>

    )

}

export default ConversationPage