import React, {useEffect, useState} from "react"
import { useNavigate, useParams} from "react-router-dom";
import {ReactComponent as ArrowLeft} from '../assets/arrow-left.svg'
import Button from "@mui/material/Button";
import {ReactComponent as CarIcon} from '../assets/car-icon.svg'
import {getUserId, request} from "../authentication";
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




const CarPage = () => {
    let [chatBox, setChatBox] = useState('')
    let [car, setCar] = useState({
    })
    const navigate = useNavigate();
    let [message, setMessage] = useState(null)
    const { id } = useParams();
    const userId = getUserId();
    let [isOwner, setIsOwner] = useState(null);
    let getCar = async () => {
        let response = await request(`/api/car/${id}/`);
        let data = await response.json();
        setCar((prevCar) => ({ ...prevCar, ...data }));
        const packetId = data?.owner?.id;
        setIsOwner(userId == packetId)

    }

    const handleChat = (event) => {
        const { value } = event.target;
        setChatBox(value)
    }

    const handleDelete = async () => {
         let response = await request(`/api/car/${id}/`, {
            method: "DELETE",
        });
         if (response.ok) {
             console.log("Car deleted successfully");
         }
         navigate(-1);
    }
    const handleGoBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        getCar()

    }, [])
    useEffect(() => {
        let title = getTitle(car);
        setTitle(title)

    }, [car])

    let getTitle = (car) => {
        return `${car.make} ${car.model} ${car.year} ${car.price} ${car.location}`;
    }

    const handleSend = async () => {
        setChatBox('')
        let response = await request(`/api/conversation/create/`, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                car: id,
                message: chatBox }),
        });
        navigate('/inbox')
    }

    const [title, setTitle] = useState("");

    const iconStyle = {
        width: '400px',  // Set your desired width
        height: '200px', // Set your desired height
        border: '2px solid', // Add a 4px orange border
        borderColor: '#f68657',
        padding: '10px'
    };
    const priceStyle = {
        fontSize: '24px', // Set your desired font size
        paddingBottom: '10px'
    };

    const inputStyle = {
        paddingLeft: '10px',
        width: '320px',
        height: '100px',
        color: '#f3f6f9',
    }

    const boxStyle = {
        border: '2px solid', // Add a 4px orange border
        borderColor: '#f68657',
        width: '400px',
        height: '100px',
    }

    const someStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
    }

    const buttonStyle = {
        color: '#f3f6f9',
    }

    const aStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
    }

    const descriptionStyle = {
        alignSelf: 'flex-start',
        paddingLeft: '50px',
        display: 'flex',
        flexDirection: 'row',
    }

    return (
        <div className="note" >
            <div className="note-header h3 svg">
                <div>
                    <Button onClick={handleGoBack}>
                        <ArrowLeft/>
                    </Button>
                </div>
                {isOwner && <Button onClick={handleDelete}>Delete</Button>}
            </div>
            <div style={someStyle}>
                <div>
                    {car.image ? (<img src={car.image} alt={"Car Image"} style={iconStyle}/>) :( <CarIcon  style={iconStyle}/>)}
                </div>
                <div style={aStyle}>
                    <h3 style={priceStyle}>{car.price}</h3>
                    <h3>{car.year} {car.make} {car.model}</h3>
                    <h3>{car.location}</h3>
                </div>
                <div style={descriptionStyle}>
                    <h3 style={{ color: '#f68657', paddingRight: '10px', }}>Description:</h3>
                    <h3>    Runs well, 120,000 miles, clean title</h3>
                </div>
                {!isOwner && <div style={textFieldContainerStyles}>
                    <TextField
                        required
                        onChange={handleChat}
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
                </div>}
            </div>



        </div>
    )

}

export default CarPage