import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({children}: any) => {
    const {user} = useContext(AuthContext);

    return user.length > 0 ? children : <Navigate to={"/login"}/>;
}

export default PrivateRoute;