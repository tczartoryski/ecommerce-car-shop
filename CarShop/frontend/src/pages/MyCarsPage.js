import React, {useState, useEffect} from "react";
import AddButton from "../components/AddButton";
import CarListItem from "../components/CarListItem";
import {useNavigate} from "react-router-dom";
import { request} from "../authentication";
const MyCarsPage = () => {
    let [cars, setCars] = useState([]);
    const navigate = useNavigate();
    useEffect(() =>{
        getCars();
    } , [navigate])



    let getCars = async () => {
        try {
            console.log("got here")
            let response = await request('/api/my-cars', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("got here")

            if (response.ok) {
                let data = await response.json();
                setCars(data);
            } else {
                console.error('Failed to fetch cars:', response.statusText);
                navigate('/market')
            }
        } catch (error) {
            console.error('Error fetching cars:', error.message);
            navigate('/')

        }
    };
    return (
        <div className="notes">
            <div className="notes-header">
                <h2 className="notes-title">&#9782; My Cars</h2>
                <p className="notes-count">{cars.length}</p>
            </div>
            <div className="notes-list">
                {cars.map((car, index) => (
                    <CarListItem key={index} car={car} />
                ))}
            </div>
            <AddButton />
        </div>
    )
}

export default MyCarsPage