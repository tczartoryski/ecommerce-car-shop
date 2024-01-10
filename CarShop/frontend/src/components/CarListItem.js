import React from 'react'
import {Link} from "react-router-dom";
import {ReactComponent as CarIcon} from '../assets/car-icon.svg'

const iconStyle = {
    width: '100px',
    height: '100px',
    border: '2px solid',
    borderColor: '#f68657',
    padding: '10px'
};
const priceStyle = {
    fontSize: '24px',
    paddingBottom: '10px'
};

const CarListItem = ({car}) => {
    return (
        <Link to={`/car/${car.id}`}>
            <div className="notes-list-item">
                <div>
                    <h3 style={priceStyle}>{car.price}</h3>
                    <h3>{car.year} {car.make} {car.model}</h3>
                    <h3>{car.location}</h3>
                </div>
                <div>
                    {car.image ? (<img src={car.image} alt={"Car Image"} style={iconStyle}/>) :( <CarIcon  style={iconStyle}/>)}
                </div>
            </div>
        </Link>
    )
}

export default CarListItem