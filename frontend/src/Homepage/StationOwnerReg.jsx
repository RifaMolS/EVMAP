import React, { useState ,useEffect} from 'react'
import { User, Phone, FileText, Mail, Lock, Zap } from 'lucide-react'

function StationOwnerReg() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [stationlicense, setStationLicense] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleForm = async () => {
        if (!name || !phone || !stationlicense || !email || !password) {
            alert('Please fill in all fields')
            return
        }

        setIsSubmitting(true)
        
        let data = {
            name: name,
            phone: phone,
            stationlicense: stationlicense,
            email: email,
            password: password,
            usertype: 3,
        }
        
        try {
            const response = await fetch('http://localhost:4000/ev/stationownerreg', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': "application/json"
                },
                body: JSON.stringify(data)
            })
            
            const result = await response.json()
            console.log(result)
            
            // Clear form
            setName('')
            setPhone('')
            setStationLicense('')
            setEmail('')
            setPassword('')
            
            setSubmitSuccess(true)
            setTimeout(() => setSubmitSuccess(false), 3000)
            
        } catch (error) {
            console.error('Error:', error)
            alert('Registration failed. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">EV Station Owner</h1>
                    <p className="text-gray-600">Register your charging station</p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-center font-medium">Registration successful! ✅</p>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    {/* Station License Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Station License</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={stationlicense}
                                onChange={(e) => setStationLicense(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Enter station license number"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Enter your email address"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Create a secure password"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleForm}
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
                            isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                        }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Registering...
                            </div>
                        ) : (
                            'Register'
                        )}
                    </button>

                    {/* Footer */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StationOwnerReg