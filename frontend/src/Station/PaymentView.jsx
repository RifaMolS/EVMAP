import React, { useEffect, useState } from 'react';
import { 
    Zap, 
    User, 
    MapPin, 
    Clock, 
    Timer, 
    DollarSign, 
    TrendingUp, 
    Calendar,
    Search,
    Filter,
    Download,
    Eye,
    BarChart3,
    Activity,
    IndianRupee
} from 'lucide-react';

function PaymentView() {
    const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')) || {});
    const [viewpayment, setViewpayment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedStation, setSelectedStation] = useState('all');

    useEffect(() => {
        const data = {
            ownerid: auth.userid
        };
        fetch('http://localhost:4000/ev/viewstationpayment', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((result) => {
            setViewpayment(Array.isArray(result) ? result : []);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching payments:', error);
            setViewpayment([]);
            setLoading(false);
        });
    }, [auth.userid]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return dateString; // Return original string if can't parse as date
            }
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            // If any error occurs, return the original string
            return dateString;
        }
    };

    const formatAmount = (amount) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

 const parseChargingTime = (time) => {
    if (!time) return 0;

    if (typeof time === 'number') {
        return time; // already in hours
    }

    const hourMatch = time.match(/(\d+(\.\d+)?)\s*(hr|hrs|hour)/i);
    const minuteMatch = time.match(/(\d+(\.\d+)?)\s*(min|minutes)/i);

    let hours = 0;
    let minutes = 0;

    if (hourMatch) {
        hours = parseFloat(hourMatch[1]);
    }

    if (minuteMatch) {
        minutes = parseFloat(minuteMatch[1]);
    }

    return hours + minutes / 60;
};


    // Get unique stations for filter
    const uniqueStations = [...new Set(viewpayment.map(p => p.sid?.stationname).filter(Boolean))];

    // Filter payments
    const filteredPayments = viewpayment.filter(payment => {
        const matchesSearch = 
            payment.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.sid?.stationname?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStation = selectedStation === 'all' || payment.sid?.stationname === selectedStation;
        
        const matchesDate = dateFilter === 'all' || (() => {
            const paymentDate = new Date(payment.booking_id?.start_time || payment.booking_id?.created_at);
            const now = new Date();
            const daysDiff = (now - paymentDate) / (1000 * 60 * 60 * 24);
            
            switch (dateFilter) {
                case 'today': return daysDiff < 1;
                case 'week': return daysDiff < 7;
                case 'month': return daysDiff < 30;
                default: return true;
            }
        })();

        return matchesSearch && matchesStation && matchesDate;
    });

    // Sort payments
    const sortedPayments = [...filteredPayments].sort((a, b) => {
        let aValue, bValue;
        switch (sortField) {
            case 'user':
                aValue = a.user_id?.name || '';
                bValue = b.user_id?.name || '';
                break;
            case 'station':
                aValue = a.sid?.stationname || '';
                bValue = b.sid?.stationname || '';
                break;
            case 'amount':
                aValue = a.booking_id?.amount || 0;
                bValue = b.booking_id?.amount || 0;
                break;
            case 'time':
                aValue = parseChargingTime(a.booking_id?.charging_time);
                bValue = parseChargingTime(b.booking_id?.charging_time);
                break;
            case 'date':
                aValue = new Date(a.booking_id?.start_time || a.booking_id?.created_at || 0);
                bValue = new Date(b.booking_id?.start_time || b.booking_id?.created_at || 0);
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

    // Calculate statistics
    const totalRevenue = viewpayment.reduce((sum, p) => sum + (p.booking_id?.amount || 0), 0);
    const totalSessions = viewpayment.length;
    const avgSessionValue = totalSessions > 0 ? totalRevenue / totalSessions : 0;
    const totalChargingTime = viewpayment.reduce((sum, p) => sum + parseChargingTime(p.booking_id?.charging_time), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Station Payment Details
                                </h1>
                                <p className="text-gray-500 mt-1">Monitor your charging station revenue and usage</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 text-sm">Total Revenue</p>
                                    <p className="text-2xl font-bold">{formatAmount(totalRevenue)}</p>
                                </div>
                                <IndianRupee className="w-8 h-8 text-emerald-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Sessions</p>
                                    <p className="text-2xl font-bold">{totalSessions}</p>
                                </div>
                                <Activity className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Avg. Session Value</p>
                                    <p className="text-2xl font-bold">{formatAmount(avgSessionValue)}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Total Charging Time</p>
                                    <p className="text-2xl font-bold">
                                        {totalChargingTime.toFixed(2)} hrs
                                    </p>
                                </div>
                                <Timer className="w-8 h-8 text-orange-200" />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by user or station name..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <select
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                value={selectedStation}
                                onChange={(e) => setSelectedStation(e.target.value)}
                            >
                                <option value="all">All Stations</option>
                                {uniqueStations.map((station) => (
                                    <option key={station} value={station}>{station}</option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                            <select
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="user">Sort by User</option>
                                <option value="station">Sort by Station</option>
                                <option value="amount">Sort by Amount</option>
                                <option value="time">Sort by Charging Time</option>
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
                                            <MapPin className="w-4 h-4" />
                                            <span>Station Name</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Start Time</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Timer className="w-4 h-4" />
                                            <span>Charging Time</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>Amount</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedPayments.length > 0 ? (
                                    sortedPayments.map((item, idx) => (
                                        <tr 
                                            key={item._id || idx} 
                                            className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200"
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
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                    <span className="text-gray-900 font-medium">
                                                        {item.sid?.stationname || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 text-sm">
                                                    {formatDate(item.booking_id?.start_time)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {item.booking_id?.charging_time || '-'}hrs
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    {formatAmount(item.booking_id?.amount)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Zap className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium">No payment records found</p>
                                                <p className="text-gray-400 text-sm">Your charging sessions will appear here once customers start using your stations</p>
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
                    Showing {sortedPayments.length} of {viewpayment.length} payment records
                    {auth.userid && (
                        <span className="ml-2">• Owner ID: {auth.userid}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaymentView;