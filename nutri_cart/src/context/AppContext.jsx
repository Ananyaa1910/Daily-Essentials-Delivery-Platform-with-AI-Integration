import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");


    //fetch seller status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth');
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    }

    // Fetch all products from live database
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/product/list`);
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch Products Error:", error);
            toast.error("Could not fetch product catalog");
        }
    };

    // Load User Profile and Cart from Backend when logged in
    const loadUserProfileAndCart = async (userToken) => {
        try {
            // Load Cart
            const cartRes = await fetch(`${backendUrl}/api/cart/get`, {
                method: "GET",
                headers: { token: userToken }
            });
            const cartData = await cartRes.json();
            if (cartData.success) {
                setCartItems(cartData.cartData);
            }
        } catch (error) {
            console.error("Load Profile/Cart Error:", error);
        }
    };

    // Add product to cart
    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Added to Cart");

        // Sync with backend if logged in
        if (token) {
            try {
                await fetch(`${backendUrl}/api/cart/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: token
                    },
                    body: JSON.stringify({ itemId })
                });
            } catch (error) {
                console.error("Sync Cart Add Error:", error);
            }
        }
    };
 //addMultipleToCart
    const addMultipleToCart = async (items) => {

        

    setCartItems(prev => {

        const updated = structuredClone(prev);

        items.forEach(item => {

            if (updated[item.product_id]) {
                updated[item.product_id] += item.quantity;
            } else {
                updated[item.product_id] = item.quantity;
            }

        });

        return updated;

    });

    if (token) {

        try {

            await fetch(`${backendUrl}/api/cart/add-multiple`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    token
                },

                body: JSON.stringify({ items })

            });

        } catch (error) {

            console.error(error);

        }

    }

    toast.success("Recommendations added!");
};

    // Update Cart Item Quantity
    const updateCartItem = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);
        toast.success("Cart Updated");

        // Sync with backend if logged in
        if (token) {
            try {
                await fetch(`${backendUrl}/api/cart/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: token
                    },
                    body: JSON.stringify({ itemId, quantity })
                });
            } catch (error) {
                console.error("Sync Cart Update Error:", error);
            }
        }
    };

    // Remove from cart
    const removeFromCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        setCartItems(cartData);
        toast.success("Removed from Cart");

        // Sync with backend if logged in
        if (token) {
            try {
                await fetch(`${backendUrl}/api/cart/remove`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: token
                    },
                    body: JSON.stringify({ itemId })
                });
            } catch (error) {
                console.error("Sync Cart Remove Error:", error);
            }
        }
    };

    // Get cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    };

    // Get Cart Total amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    // Auto load on mount
    useEffect(() => {
        loadUserProfileAndCart();
        fetchSeller();
        fetchProducts();
    }, []);

    // Load user and cart when token changes
    useEffect(() => {
        if (token) {
            // Save user details decoded or fetched
            // Decoded JWT email or details can be saved, or we can fetch a profile API.
            // Let's decode token payload manually to set basic user state
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decoded = JSON.parse(jsonPayload);

                setUser({
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.email === "admin@gmail.com" ? "Seller Account" : "User"
                });

                if (decoded.isSeller || decoded.email === "admin@gmail.com") {
                    setIsSeller(true);
                } else {
                    setIsSeller(false);
                }

                loadUserProfileAndCart(token);
            } catch (e) {
                console.error("Token decoding error:", e);
                localStorage.removeItem("token");
                setToken("");
            }
        } else {
            setUser(null);
            setIsSeller(false);
            setCartItems({});
        }
    }, [token]);

    const value = {
        backendUrl,
        token,
        setToken,
        navigate,
        user,
        setUser,
        setIsSeller,
        isSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        fetchProducts,
        currency,
        addToCart,
        addMultipleToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        setCartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        axios
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};