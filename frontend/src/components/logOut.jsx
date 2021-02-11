import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuthorization }from "../services/authService"

const Logout = ({ auth: { logout } }) => {
    useEffect(() => logout(), [logout]);
    return <Redirect to="/login" />
}
 
export default withAuthorization(Logout);
