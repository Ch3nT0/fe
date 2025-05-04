
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutesAdmin() {

    const isAdmin = useSelector((state) => state.auth.isAdmin);
    if (!isAdmin ) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
