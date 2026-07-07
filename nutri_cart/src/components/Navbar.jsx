import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

import toast from 'react-hot-toast'

export const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const [isAiMode, setIsAiMode] = useState(false) // Track standard vs AI search
    const [aiQuery, setAiQuery] = useState('')
    const [isAiLoading, setIsAiLoading] = useState(false)

    const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios, setToken, setIsSeller } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
                setToken("")
                localStorage.removeItem("token")
                setUser(null);
                setIsSeller(false);
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Triggered when hitting Enter in the AI search bar
   const handleAiSubmit = async (e) => {
    if (e.key !== "Enter" || aiQuery.trim().length === 0) return;

    setIsAiLoading(true);

    try {
        const response = await fetch(
            `${import.meta.env.VITE_AI_SERVICE_URL}/api/ai/recommend`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: aiQuery,
                    user_id: user?.id || "guest"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "AI recommendation failed");
        }

        navigate("/products", {
            state: {
                aiAnalysis: data
            }
        });

        setAiQuery("");

    } catch (error) {
        console.error(error);
        toast.error(error.message);
    } finally {
        setIsAiLoading(false);
    }
};

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products")
        }
    }, [searchQuery])

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">All Products</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                {/* DYNAMIC SEARCH BAR WITH BLUE OUTLINE ON AI MODE */}
                <div className={`hidden lg:flex items-center text-sm gap-2 border px-2 py-1 rounded-full transition-all duration-300 w-72 xl:w-96 ${isAiMode ? 'border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] bg-white' : 'border-gray-300 bg-transparent'}`}>

                    {/* Sliding Toggle Switch (No / Yes) */}
                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                        <span className="text-[11px] font-bold text-gray-500">AI</span>
                        <div
                            onClick={() => setIsAiMode(!isAiMode)}
                            className={`relative w-14 h-7 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${isAiMode ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            {/* Inner labels */}
                            <span className={`absolute right-2 text-[10px] font-bold text-gray-400 transition-opacity duration-200 ${isAiMode ? 'opacity-0' : 'opacity-100'}`}>No</span>
                            <span className={`absolute left-2 text-[10px] font-bold text-white transition-opacity duration-200 ${isAiMode ? 'opacity-100' : 'opacity-0'}`}>Yes</span>

                            {/* Sliding Knob */}
                            <div
                                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 z-10 ${isAiMode ? 'translate-x-7' : 'translate-x-0'}`}
                            />
                        </div>
                    </div>

                    {isAiMode ? (
                        <input
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            onKeyDown={handleAiSubmit}
                            disabled={isAiLoading}
                            className="w-full bg-transparent outline-none text-gray-800 px-1 placeholder-gray-400"
                            type="text"
                            placeholder={isAiLoading ? "Processing query..." : "Find supplements for..."}
                        />
                    ) : (
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent outline-none placeholder-gray-500 px-1"
                            type="text"
                            placeholder="Search products"
                        />
                    )}

                    {/* Magnifying Search Icon Circle */}
                    <button
                        type="button"
                        onClick={() => {
                            if (isAiMode) {
                                handleAiSubmit({ key: "Enter" });
                            }
                            }}
                        className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${isAiMode ? 'bg-green-600 text-white' : 'bg-transparent'}`}
                    >
                        <img
                            src={assets.search_icon}
                            alt='search'
                            className={`w-4 h-4 ${isAiMode ? 'invert brightness-0' : ''}`}
                        />
                    </button>
                </div>

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (
                    <button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                        Login
                    </button>
                ) : (
                    <div className='relative group'>
                        <img src={assets.profile_icon} className='w-10' alt="" />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={() => navigate("my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
                            <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Mobile View Cart/Menu actions */}
            <div className='flex items-center gap-6 sm:hidden'>
                {/* Mobile AI Quick Toggle Switch */}
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-500">AI</span>
                    <div
                        onClick={() => { setIsAiMode(!isAiMode); if (!isAiMode) setOpen(true); }}
                        className={`relative w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer select-none transition-colors duration-300 ${isAiMode ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${isAiMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu">
                    <img src={assets.menu_icon} alt='menu' />
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {open && (
                <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50">

                    {/* Render blue-outlined AI mobile input inside the mobile dropdown when mode is active */}
                    {isAiMode && (
                        <div className="w-full mb-3 flex items-center gap-2 border border-blue-500 bg-white px-3 py-2 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.3)]">
                            <input
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                onKeyDown={handleAiSubmit}
                                disabled={isAiLoading}
                                className="w-full bg-transparent outline-none text-gray-800 text-xs placeholder-gray-400"
                                type="text"
                                placeholder={isAiLoading ? "Processing..." : "Find supplements for..."}
                            />
                        </div>
                    )}

                    <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)}>All Products</NavLink>
                    {user && <NavLink to="/products" onClick={() => setOpen(false)}>My Orders</NavLink>}
                    <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>

                    {!user ? (
                        <button onClick={() => { setOpen(false); setShowUserLogin(true); }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                            Login
                        </button>
                    ) : (
                        <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}
export default Navbar