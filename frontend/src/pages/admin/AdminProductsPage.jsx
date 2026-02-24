import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import adminApi from '../../api/adminApi';
import { toast } from 'react-hot-toast';
import { formatMoney } from '../../utils/formatMoney';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await adminApi.adminGetProducts();
            setProducts(response.data.content || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleUpdateStatus = async (productId, status) => {
        try {
            await adminApi.updateProductStatus(productId, { status });
            toast.success(`Product is now ${status}`);
            fetchProducts();
        } catch (error) {
            toast.error('Failed to update product status');
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || product.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products Audit</h1>
                    <p className="text-slate-500 mt-1">Review and manage product listings from all sellers.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search product, SKU or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    {['ALL', 'ACTIVE', 'DRAFT', 'INACTIVE'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === status
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price/Stock</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-12 w-48 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-32 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-10 w-24 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-10 w-20 bg-slate-100 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                                                    {product.thumbnailUrl ? (
                                                        <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-slate-900 truncate max-w-[200px]">{product.name}</div>
                                                    <div className="text-sm text-slate-500">#{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{product.companyName}</div>
                                                <div className="text-xs text-slate-500">{product.sellerName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-900">{formatMoney(product.pricePaise)}</div>
                                            <div className="text-xs text-slate-500">{product.stockQuantity} {product.unit} in stock</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${product.status === 'ACTIVE'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : product.status === 'DRAFT'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                        : 'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {product.status !== 'ACTIVE' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(product.id, 'ACTIVE')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                        title="Approve & Activate"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {product.status !== 'INACTIVE' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(product.id, 'INACTIVE')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Reject & Deactivate"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <a
                                                    href={`/products/${product.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="View Public Link"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;
