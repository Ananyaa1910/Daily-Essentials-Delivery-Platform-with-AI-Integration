import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    
    const { backendUrl, token, setCartItems } = useAppContext()
    const navigate = useNavigate()

    const verifyPayment = async () => {
        try {
            if (!token) return;

            const response = await fetch(`${backendUrl}/api/order/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: token
                },
                body: JSON.stringify({ orderId, success })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setCartItems({}); // Clear cart on success
                navigate("/my-orders");
            } else {
                toast.error(data.message || "Payment cancelled");
                navigate("/cart");
            }
        } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Payment verification failed");
            navigate("/cart");
        }
    }

    useEffect(() => {
        if (token && orderId) {
            verifyPayment();
        }
    }, [token, orderId])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Verifying your payment, please wait...</p>
        </div>
    )
}

export default Verify
