import { useState } from 'react';
import './navbar.css';

export default function BootstrapNavbar() {
    const user = localStorage.getItem("user");
    const [_, setError] = useState("")
    const [email, setEmail] = useState(user ? JSON.parse(user).email : "");
    const [userType, setUserType] = useState(user? JSON.parse(user).userType : "");

    async function handleLogout() {
        try {
            // await logout();
            localStorage.removeItem('user');
            setError("")
        } catch {
            setError("Failed to log out");
        }
    }

    function toggleNavbar(collapseID){
        document.getElementById(collapseID).classList.toggle("hidden");
        document.getElementById(collapseID).classList.toggle("flex");
    }

    return (
        <nav className="flex items-center justify-between flex-wrap p-6">
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 burger-icon"
                onClick={() => toggleNavbar('example-collapse-navbar')}>
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>

            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden flex" id="example-collapse-navbar">
                <div className="text-sm lg:flex-grow">
                    <a href="/" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                        About
                    </a>
                    { email && 
                    <a href="/offers" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                        Offers
                    </a>
                    }
                    { email &&
                    <a href="/requests" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                        Requests
                    </a>
                    }
                    <a href="/info" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                        Emergency info
                    </a>
                </div>
                <div className="text-sm">
                    {!email ?
                    <>
                        <a href="/login" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                            Login
                        </a>
                        <a href="/register" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                            Register
                        </a>
                    </> : 
                    <>
                        { userType && userType === "refugee" &&
                            <a href="/request-form" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                                Add Request
                            </a>
                        }
                        { userType && userType === "helper" &&
                            <a href="/offer-form" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                                Add Offer
                            </a>
                        }
                        <a href="/account" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item">
                            Account
                        </a>
                        <a href="/login" className="block mt-3 lg:inline-block lg:mt-0 text-teal-200 mr-4 nav-item"
                        onClick={handleLogout}>
                            Logout
                        </a>
                    </>}
                </div>
            </div>
        </nav>
    )  
}