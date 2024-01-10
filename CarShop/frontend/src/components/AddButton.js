import React from "react";
import {ReactComponent as AddIcon} from '../assets/add.svg'
import {Link} from "react-router-dom";
const AddButton = () => {

    return (
        <div>
            <Link to={'/add-car'} className="floating-button">
                <AddIcon />
            </Link>
        </div>
    );
}

export default AddButton