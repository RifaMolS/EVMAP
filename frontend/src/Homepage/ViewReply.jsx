import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Calendar, Shield, Building } from 'lucide-react';

function ViewReply() {
    const [replyview, setReplyview] = useState([]);
    // Note: In actual implementation, use your localStorage
    const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));

    useEffect(() => {
        const data = {
            userId: auth.userid
        };
        fetch('http://localhost:4000/ev/viewreply', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((result) => {
            setReplyview(Array.isArray(result) ? result : []);
        })
        .catch((error) => {
            setReplyview([]);
            console.error("Fetch error:", error);
        });
    }, [auth.userid]);

    const [tailwindReady, setTailwindReady] = useState(false);

  useEffect(() => {
    // Check if Tailwind is already loaded
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    // Optional: Remove script when component unmounts
    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }
    const adminReplies = replyview.filter(reply => reply.admin_id === "680c696650f71eb03b4875b1");
    const stationReplies = replyview.filter(reply => reply.admin_id !== "680c696650f71eb03b4875b1");

    const ReplyCard = ({ reply, isAdmin }) => (
        <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
            isAdmin ? 'border-l-blue-500 hover:border-l-blue-600' : 'border-l-green-500 hover:border-l-green-600'
        } overflow-hidden`}>
            <div className={`px-6 py-4 ${isAdmin ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-green-50 to-green-100'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${isAdmin ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {isAdmin ? <Shield className="w-5 h-5 text-white" /> : <Building className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${isAdmin ? 'text-blue-800' : 'text-green-800'}`}>
                                {isAdmin ? 'Admin Reply' : 'Station Reply'}
                            </h3>
                            <p className={`text-sm ${isAdmin ? 'text-blue-600' : 'text-green-600'}`}>
                                Response to your complaint
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                            {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }) : '-'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="px-6 py-5 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2 text-gray-600" />
                        Original Complaint
                    </h4>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Subject:</span> {reply.complaint_id?.subject || '-'}
                        </p>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded border-l-2 border-gray-300">
                            {reply.complaint_id?.message || '-'}
                        </p>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-600" />
                        Response
                    </h4>
                    <div className={`p-4 rounded-lg border-l-4 ${
                        isAdmin 
                            ? 'bg-blue-50 border-l-blue-400 text-blue-900' 
                            : 'bg-green-50 border-l-green-400 text-green-900'
                    }`}>
                        <p className="leading-relaxed">{reply.replies}</p>
                    </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium mr-2">Responded by:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isAdmin 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {isAdmin ? "System Admin" : `Station Owner: ${reply.owner_id?.name || '-'}`}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">Reply Management</h1>
                    <p className="text-gray-600 text-lg">View and track responses to your complaints</p>
                </div>

                {Array.isArray(replyview) && replyview.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Admin Replies Section */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                                <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                    <Shield className="w-6 h-6 mr-3" />
                                    Admin Replies
                                    <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {adminReplies.length}
                                    </span>
                                </h2>
                            </div>
                            
                            <div className="space-y-6">
                                {adminReplies.length > 0 ? (
                                    adminReplies.map((reply) => (
                                        <ReplyCard key={reply._id} reply={reply} isAdmin={true} />
                                    ))
                                ) : (
                                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-blue-200">
                                        <Shield className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Admin Replies</h3>
                                        <p className="text-gray-500">No responses from admin yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Station Replies Section */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
                                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                                    <Building className="w-6 h-6 mr-3" />
                                    Station Replies
                                    <span className="ml-auto bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {stationReplies.length}
                                    </span>
                                </h2>
                            </div>
                            
                            <div className="space-y-6">
                                {stationReplies.length > 0 ? (
                                    stationReplies.map((reply) => (
                                        <ReplyCard key={reply._id} reply={reply} isAdmin={false} />
                                    ))
                                ) : (
                                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-green-200">
                                        <Building className="w-12 h-12 text-green-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Station Replies</h3>
                                        <p className="text-gray-500">No responses from stations yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md mx-auto">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Replies Found</h3>
                        <p className="text-gray-500 leading-relaxed">
                            You haven't received any replies to your complaints yet. 
                            Check back later for updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewReply;