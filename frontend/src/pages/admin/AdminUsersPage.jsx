import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Search, Filter, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import adminApi from '../../api/adminApi';
import { toast } from 'react-hot-toast';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.adminGetUsers();
            setUsers(response.data.content || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId) => {
        try {
            await adminApi.toggleUserStatus(userId);
            toast.success('User status updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
                    <p className="text-slate-500 mt-1">View and manage all registered users across the platform.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-slate-100 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-sm text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(user.roles || []).map(role => (
                                                    <span key={role} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                                        {role.replace('ROLE_', '')}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${user.status === 'ACTIVE'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : user.status === 'SUSPENDED'
                                                        ? 'bg-red-50 text-red-700 border-red-200'
                                                        : 'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(user.id)}
                                                className={`p-2 rounded-lg transition-colors ${user.status === 'ACTIVE'
                                                        ? 'text-red-500 hover:bg-red-50'
                                                        : 'text-green-500 hover:bg-green-50'
                                                    }`}
                                                title={user.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                                            >
                                                {user.status === 'ACTIVE' ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        No users found matching your search.
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

export default AdminUsersPage;
