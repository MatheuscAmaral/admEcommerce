import { Outlet } from "react-router-dom"
import Aside from "../sidebar"

const Layout = () => {
    return (
        <div className={`flex max-h-screen gap-5 h-screen`}>
            <div className="hidden sm:flex w-1 xl:w-72 transition-all">
                <Aside/>
            </div>
            
            <div className={`mt-0 w-full sm:ml-16 xl:ml-0`}>            
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout;