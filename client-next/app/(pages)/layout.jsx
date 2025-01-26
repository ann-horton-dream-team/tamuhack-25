import { Toaster } from "react-hot-toast";
import Navbar from "./_components/Navbar";
import MobileNavbar from "./_components/MobileNavbar";
import "regenerator-runtime/runtime";


const PageLayout = ({ children }) => {
    return ( 
        <div>
            <main>
                <Toaster />
                <Navbar />
                <MobileNavbar />
                {children}
            </main>
        </div>
     );
}
 
export default PageLayout;