import { useEffect, useState } from 'react';
import { CreditCard, User, MapPin, Calendar, Search, Filter, Download, IndianRupee } from 'lucide-react';

function ViewPayment() {
    const [viewpayment, setViewpayment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetch('http://localhost:4000/ev/viewadminpayment')
            .then((res) => res.json())
            .then((result) => {
                setViewpayment(result);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching payments:', error);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredPayments = viewpayment.filter(payment =>
        payment.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.ownerid?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.sid?.stationname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPayments = [...filteredPayments].sort((a, b) => {
        let aValue, bValue;
        switch (sortField) {
            case 'user':
                aValue = a.user_id?.name || '';
                bValue = b.user_id?.name || '';
                break;
            case 'owner':
                aValue = a.ownerid?.name || '';
                bValue = b.ownerid?.name || '';
                break;
            case 'station':
                aValue = a.sid?.stationname || '';
                bValue = b.sid?.stationname || '';
                break;
            case 'amount':
                aValue = a.booking_id?.amount || 0;
                bValue = b.booking_id?.amount || 0;
                break;
            case 'date':
                aValue = new Date(a.booking_id?.created_at || 0);
                bValue = new Date(b.booking_id?.created_at || 0);
                break;
            default:
                return 0;
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-100 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Payment Management
                                </h1>
                                <p className="text-gray-500 mt-1">Track and manage all payment transactions</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Payments</p>
                                    <p className="text-2xl font-bold">{viewpayment.length}</p>
                                </div>
                                <CreditCard className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total Revenue</p>
                                    <p className="text-2xl font-bold">
                                        {formatAmount(viewpayment.reduce((sum, p) => sum + (p.booking_id?.amount || 0), 0))}
                                    </p>
                                </div>
                                <IndianRupee className="w-8 h-8 text-green-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Active Users</p>
                                    <p className="text-2xl font-bold">
                                        {new Set(viewpayment.map(p => p.user_id?.name)).size}
                                    </p>
                                </div>
                                <User className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Stations</p>
                                    <p className="text-2xl font-bold">
                                        {new Set(viewpayment.map(p => p.sid?.stationname)).size}
                                    </p>
                                </div>
                                <MapPin className="w-8 h-8 text-orange-200" />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by user, owner, or station name..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="user">Sort by User</option>
                                <option value="owner">Sort by Owner</option>
                                <option value="station">Sort by Station</option>
                                <option value="amount">Sort by Amount</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                            >
                                <Filter className="w-4 h-4" />
                                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>User Name</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>Owner Name</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>Station Name</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>Amount</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Date</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedPayments.length > 0 ? (
                                    sortedPayments.map((item, index) => (
                                        <tr 
                                            key={item.payment_id || index} 
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                        {(item.user_id?.name || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-gray-900 font-medium">
                                                        {item.user_id?.name || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                        {(item.ownerid?.name || 'O')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-gray-900 font-medium">
                                                        {item.ownerid?.name || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                                    <span className="text-gray-900 font-medium">
                                                        {item.sid?.stationname || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    {formatAmount(item.booking_id?.amount || 0)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 text-sm">
                                                    {formatDate(item.booking_id?.created_at || new Date())}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <CreditCard className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium">No payments found</p>
                                                <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-sm">
                    Showing {sortedPayments.length} of {viewpayment.length} payments
                </div>
            </div>
        </div>
    );
}

export default ViewPayment;