import React, {useState, useEffect} from "react";
import CarListItem from "../components/CarListItem";
import {useNavigate} from "react-router-dom";
import { isAuthenticated, request} from "../authentication";
const MarketPage = () => {
    let [cars, setCars] = useState([])
    const navigate = useNavigate()
    useEffect(() =>{
        if (!isAuthenticated()) {
            navigate('/login')
        }
        getCars()
    } , [navigate])


    let getCars = async () => {
        let response = await request('/api/market-cars')
        let data = await response.json()
        setCars(data)
    }
    return (
        <div className="notes">
            <div className="notes-header">
                <h2 className="notes-title">&#9782; Market</h2>
                <p className="notes-count">{cars.length}</p>
            </div>
            <div className="notes-list">
                {cars.map((car, index) => (
                    <CarListItem key={index} car={car}/>
                ))}
            </div>
        </div>
    )
}

export default MarketPage