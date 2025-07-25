import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { MessageCircle, Send, Check, User, Building, MapPin, Mail, AlertCircle, Loader, Clock, CheckCircle } from 'lucide-react';

function ComplaintViewReply() {
    const [complaintview, setComplaintview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingReply, setSendingReply] = useState(null);
    const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));
    
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:4000/ev/viewcomplaint')
            .then((res) => res.json())
            .then((result) => {
                setComplaintview(result);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Complaint fetch error:", error);
                setLoading(false);
            });
    }, []);

    const [showReplyBox, setShowReplyBox] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    const handleReplyClick = (index) => {
        setShowReplyBox(index === showReplyBox ? null : index);
        setReplyMessage('');
    };

    const handleSendReply = (complaint) => {
        setSendingReply(complaint._id);
        
        // Prepare all required fields for the reply
        const replyData = {
            complaint_id: complaint?._id || '',
            user_id: complaint.userId || '',
            station_id: complaint?.station_id?._id || complaint?.station_id || '',
            owner_id: complaint?.stationowner_id?._id || complaint?.stationowner_id || '',
            replies: replyMessage,
        };

        fetch(`http://localhost:4000/ev/replycomplaint/${complaint._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(replyData),
        })
            .then(res => res.json())
            .then(() => {
                setShowReplyBox(null);
                setReplyMessage('');
                setSendingReply(null);
                setComplaintview(prev => 
                    prev.map(item => 
                        item._id === complaint._id ? { ...item, status: 1 } : item
                    )
                );
            })
            .catch(error => {
                console.error("Reply send error:", error);
                setSendingReply(null);
            });

        fetch('http://localhost:4000/ev/addstatus', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                complaint_id: complaint._id,
                status: 1
            })
        })
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <MessageCircle className="w-10 h-10 text-indigo-600" />
                        Complaint Management
                    </h1>
                    <p className="text-gray-600 text-lg">View and respond to customer complaints</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Complaints</p>
                                <p className="text-3xl font-bold text-gray-800">{complaintview.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <AlertCircle className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Pending Replies</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {complaintview.filter(c => c.status !== 1).length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Resolved</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {complaintview.filter(c => c.status === 1).length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaints Table/Cards */}
                {complaintview.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Complaints Found</h3>
                        <p className="text-gray-600">There are no complaints to display at the moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden xl:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Recipient
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Owner
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4" />
                                                Station
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                User
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {Array.isArray(complaintview) && complaintview.map((items, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{items.recipient}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-700">{items.stationowner_id?.name || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-700">{items.station_id?.stationname || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-700">{items.userId?.name || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 max-w-xs truncate" title={items.subject}>
                                                    {items.subject}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-700 max-w-xs truncate" title={items.message}>
                                                    {items.message}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    {items.status === 1 ? (
                                                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Replied
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={() => handleReplyClick(index)}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                                                            >
                                                                <MessageCircle className="w-4 h-4" />
                                                                Reply
                                                            </button>
                                                            {showReplyBox === index && (
                                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-w-64">
                                                                    <textarea
                                                                        value={replyMessage}
                                                                        onChange={e => setReplyMessage(e.target.value)}
                                                                        placeholder="Type your reply..."
                                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                                        rows="3"
                                                                    />
                                                                    <div className="flex gap-2 mt-3">
                                                                        <button 
                                                                            onClick={() => handleSendReply(items)}
                                                                            disabled={!replyMessage.trim() || sendingReply === items._id}
                                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        >
                                                                            {sendingReply === items._id ? (
                                                                                <Loader className="w-4 h-4 animate-spin" />
                                                                            ) : (
                                                                                <Send className="w-4 h-4" />
                                                                            )}
                                                                            Send
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => setShowReplyBox(null)}
                                                                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile/Tablet Card View */}
                        <div className="xl:hidden p-4 space-y-6">
                            {Array.isArray(complaintview) && complaintview.map((items, index) => (
                                <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-indigo-600" />
                                            <span className="font-semibold text-gray-800">{items.recipient}</span>
                                        </div>
                                        {items.status === 1 ? (
                                            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                <CheckCircle className="w-4 h-4" />
                                                Replied
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                                Pending
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                <User className="w-4 h-4" />
                                                <span className="text-sm font-medium">Owner</span>
                                            </div>
                                            <div className="font-medium text-gray-800">{items.stationowner_id?.name || "N/A"}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                <Building className="w-4 h-4" />
                                                <span className="text-sm font-medium">Station</span>
                                            </div>
                                            <div className="font-medium text-gray-800">{items.station_id?.stationname || "N/A"}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                <User className="w-4 h-4" />
                                                <span className="text-sm font-medium">User</span>
                                            </div>
                                            <div className="font-medium text-gray-800">{items.userId?.name || "N/A"}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-gray-600 text-sm font-medium mb-1">Subject</div>
                                            <div className="font-medium text-gray-800">{items.subject}</div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="mb-4">
                                        <div className="text-gray-600 text-sm font-medium mb-2">Message</div>
                                        <div className="bg-gray-100 p-3 rounded-lg text-gray-700">
                                            {items.message}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    {items.status !== 1 && (
                                        <div>
                                            <button 
                                                onClick={() => handleReplyClick(index)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mb-3"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Reply
                                            </button>
                                            {showReplyBox === index && (
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <textarea
                                                        value={replyMessage}
                                                        onChange={e => setReplyMessage(e.target.value)}
                                                        placeholder="Type your reply..."
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                        rows="3"
                                                    />
                                                    <div className="flex gap-2 mt-3">
                                                        <button 
                                                            onClick={() => handleSendReply(items)}
                                                            disabled={!replyMessage.trim() || sendingReply === items._id}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {sendingReply === items._id ? (
                                                                <Loader className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Send className="w-4 h-4" />
                                                            )}
                                                            Send
                                                        </button>
                                                        <button 
                                                            onClick={() => setShowReplyBox(null)}
                                                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ComplaintViewReply