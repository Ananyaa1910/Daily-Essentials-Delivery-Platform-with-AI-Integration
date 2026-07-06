import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { useLocation } from 'react-router-dom'
import { Sparkles, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

const AllProducts = () => {
    const { products, searchQuery, addMultipleToCart, navigate } = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])
    const location = useLocation()

    const aiAnalysis = location.state?.aiAnalysis
    const aiRecommendations = aiAnalysis?.recommended_items || []

    useEffect(() => {
        if (searchQuery.length > 0) {
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        } else {
            setFilteredProducts(products)
        }
    }, [products, searchQuery])

   
const handleAddRecommendedToCart = async () => {
    if (aiRecommendations.length === 0) return;
    console.log(aiRecommendations);

    await addMultipleToCart(aiRecommendations);

    toast.success("All recommended items added to cart!");

    navigate("/cart");
};
        

    return (
        <div className='mt-16 flex flex-col'>
            {/* AI Recommendations Section */}
            {aiRecommendations.length > 0 && (
                <div className="mb-12 p-6 rounded-2xl bg-purple-50/50 border border-purple-200/85 shadow-sm max-w-4xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                        <h2 className="text-xl font-semibold text-purple-900">AI Personal Recommendations</h2>
                    </div>
                    <p className="text-sm text-purple-700/80 mb-6">
                        We found the following products matching your query that are currently in stock:
                    </p>

                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                        {aiRecommendations.map((item, idx) => {
                            const productInfo = products.find(p => p._id === item.product_id);
                            return (
                                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white border border-purple-100/70 shadow-sm items-center">
                                    {productInfo && (
                                        <div className="w-16 h-16 shrink-0 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                                            <img src={productInfo.image[0]} alt={productInfo.name} className="max-w-full max-h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{productInfo?.name || item.name}</h3>
                                        <p className="text-xs text-purple-600 font-medium mt-0.5">Quantity: {item.quantity} recommended</p>
                                        <p className="text-xs text-gray-500 mt-1 italic">"{item.reason}"</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={handleAddRecommendedToCart} 
                        className="flex items-center justify-center gap-2 cursor-pointer px-6 py-3 bg-purple-600 hover:bg-purple-700 transition text-white rounded-full font-medium text-sm border-none shadow"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add Recommended Items to Cart
                    </button>
                </div>
            )}

            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>
                    {aiRecommendations.length > 0 ? "Browse Other products" : "All products"}
                </p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 '>
                {filteredProducts.filter((product) => product.inStock).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default AllProducts;