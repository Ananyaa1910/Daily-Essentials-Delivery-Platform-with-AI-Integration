import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {

    const { currency, backendUrl, token } = useAppContext()
    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${backendUrl}/api/order/list`, {
                method: "GET",
                headers: { token }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Fetch seller orders error:", error);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            const response = await fetch(`${backendUrl}/api/order/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: token
                },
                body: JSON.stringify({ orderId, status })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Update status error:", error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])




  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>

<div className="md:p-10 p-4 space-y-4">
    <h2 className="text-lg font-medium">Orders List</h2>
    {orders.map((order, index) => (
        <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
            <div className="flex gap-5 max-w-80">
                <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                <div>
                    {order.items.map((item, index) => (
                        <div key={index} className="flex flex-col">
                            <p className="font-medium">
                                {item.product.name}{" "}
                                <span className="text-primary">x {item.quantity}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-sm md:text-base text-black/60">
                <p className='text-black/80'>
                    {order.address.firstName} {order.address.lastName}</p>

                <p>{order.address.street}, {order.address.city} </p>
                 <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                 <p></p>
                 <p>
                    {order.address.phone}
                 </p>
            </div>

            <p className="font-medium text-lg my-auto ">{currency}{order.amount}</p>

            <div className="flex flex-col text-sm md:text-base text-black/60 gap-1">
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="mt-1 outline-none border border-gray-300 rounded px-2 py-1 text-xs md:text-sm bg-white text-gray-700 cursor-pointer"
                >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>

        </div>
    ))}
</div>

    </div>
   
  )
}

export default Orders