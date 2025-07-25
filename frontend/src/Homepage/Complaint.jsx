import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, CheckCircle, AlertTriangle, User, MapPin, FileText, Eye } from 'lucide-react';

function Complaint() {
    const [recipientType, setRecipientType] = useState('');
    const [station, setStation] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [stationId, setStationId] = useState('');
    const [stationOwnerId, setStationOwnerId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));
   
    useEffect(() => {
        if (recipientType === "station") {
            fetch('http://localhost:4000/ev/viewstation')
                .then((res) => res.json())
                .then((result) => setStation(result))
                .catch((error) => console.error("Station fetch error:", error));
        }
    }, [recipientType]);

    // Set owner info when a station is selected
    useEffect(() => {
        if (recipientType === "station" && selectedStation) {
            const selected = station.find(item => item.stationname === selectedStation);
            if (selected) {
                setOwnerName(selected.ownerid?.name || '');
                setStationOwnerId(selected.ownerid?._id || '');
                setStationId(selected._id || '');
            } else {
                setOwnerName('');
                setStationOwnerId('');
                setStationId('');
            }
        } else {
            setOwnerName('');
            setStationOwnerId('');
            setStationId('');
        }
    }, [selectedStation, station, recipientType]);

    const handleSubmit = () => {
        setIsSubmitting(true);
        const data = {
            message,
            subject,
            userId: auth.userid,
            recipient: recipientType
        };

        if (recipientType === "station") {
            data.station_id = stationId;
            data.stationowner_id = stationOwnerId;
        }

        fetch('http://localhost:4000/ev/addcomplaint', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((result) => {
                setStatusMsg("Complaint submitted successfully!");
                setShowSuccess(true);
                // Reset form
                setMessage('');
                setSubject('');
                setSelectedStation('');
                setRecipientType('');
                setOwnerName('');
                setStationOwnerId('');
                setStationId('');
                setIsSubmitting(false);
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                    setStatusMsg('');
                }, 3000);
            })
            .catch((error) => {
                console.error("Submit error:", error);
                setStatusMsg("Failed to submit complaint. Please try again.");
                setIsSubmitting(false);
            });
    };

    const isFormValid = () => {
        if (!recipientType) return false;
        if (recipientType === "station" && !selectedStation) return false;
        if (!subject.trim() || !message.trim()) return false;
        return true;
    };

    const handleBack = () => {
    navigate('/');
  };
  const navigate = useNavigate();

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <MessageCircle className="h-10 w-10 text-indigo-600 mr-3" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Submit Complaint
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">We're here to help resolve your concerns</p>
                    <div className="flex justify-center mb-6 pt-4">
  <button 
    onClick={handleBack}
    className="group flex items-center gap-3 px-6 py-3 bg-blue-100 text-blue-700 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-blue-300"
  >
    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Back
  </button>
</div>

                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center animate-fade-in">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-green-700 font-medium">{statusMsg}</span>
                    </div>
                )}

                {/* Main Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Complaint Details
                        </h2>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Recipient Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Recipient *
                            </label>
                            <div className="relative">
                                <select 
                                    value={recipientType} 
                                    onChange={e => setRecipientType(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none cursor-pointer"
                                >
                                    <option value="">Choose recipient type</option>
                                    <option value="admin">🏢 Admin</option>
                                    <option value="station">⚡ Station</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Station Selection */}
                        {recipientType === "station" && (
                            <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        <MapPin className="h-4 w-4 inline mr-1" />
                                        Select Station *
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={selectedStation} 
                                            onChange={e => setSelectedStation(e.target.value)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none cursor-pointer"
                                        >
                                            <option value="">Choose a station</option>
                                            {station.map((item) => (
                                                <option key={item._id} value={item.stationname}>
                                                    {item.stationname}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {ownerName && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <User className="h-4 w-4 inline mr-1" />
                                            Station Owner
                                        </label>
                                        <div className="flex items-center bg-white rounded-xl p-4 border border-gray-200">
                                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-gray-700">{ownerName}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Subject and Message */}
                        {(recipientType === "admin" || recipientType === "station") && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="Brief description of your complaint"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Message *
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Please provide detailed information about your complaint..."
                                        rows="6"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    />
                                    <div className="text-right text-sm text-gray-500">
                                        {message.length}/500 characters
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!isFormValid() || isSubmitting}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" />
                                                Submit Complaint
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {statusMsg && !showSuccess && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                                <span className="text-red-700">{statusMsg}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Complaints Link */}
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => window.location.href = '/viewcomplaint'}
                        className="inline-flex items-center bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-200"
                    >
                        <Eye className="h-5 w-5 mr-2" />
                        View My Complaints
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2 text-indigo-600" />
                        Need Help?
                    </h3>
                    <div className="text-gray-600 space-y-2">
                        <p>• Be specific and clear about your complaint</p>
                        <p>• Include relevant details like dates, times, and locations</p>
                        <p>• We aim to respond within 24-48 hours</p>
                        <p>• You can track your complaint status anytime</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Complaint;