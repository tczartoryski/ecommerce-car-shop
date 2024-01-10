import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {isAuthenticated, logout} from "../authentication";

const Header = () => {
    useEffect(() => {})
    const isLoggedIn = isAuthenticated();
    return (
        <div className="app-header">
            <h1>Car-Shop</h1>
            {isLoggedIn && (
                <>
                        <Link to='/my-cars'>
                            <h2>My Cars</h2>
                        </Link>
                        <Link to='/market'>
                            <h2>Market</h2>
                        </Link>
                        <Link to='/inbox'>
                            <h2>Inbox</h2>
                        </Link>
                        <Button onClick={logout}>
                            <h2>Logout</h2>
                        </Button>
                </>
                )
            }
        </div>
    )
}

export default Header