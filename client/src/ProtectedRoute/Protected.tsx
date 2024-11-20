import { useAuth } from "../Context/Auth_context";

import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
    children: React.ReactNode;
}

const Protected : React.FC<ProtectedRouteProps> = ({children}) => {
   
    const {isAuth} = useAuth();

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return(
       <>
        {children}
       </>
    );
}

export default Protected;