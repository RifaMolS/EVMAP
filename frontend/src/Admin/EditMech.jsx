import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EditMech() {
    const location = useLocation();
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [experience, setExperience] = useState('');
    const [address, setAddress] = useState('');
    const [time, setTime] = useState('');
    // Error state for validation
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        let edits = {
            id: location.state.id,
        };
        fetch('http://localhost:4000/ev/editmech', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(edits)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setName(data.name || '');
                // Ensure contact is stored as a string
                setContact(data.contact ? String(data.contact) : '');
                setExperience(data.experience || '');
                setAddress(data.address || '');
                setTime(data.time || '')
            })
            .catch((err) => {
                console.log("error", err);
            })
    }, []);

    // Validation function
    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!name || !name.trim()) {
            formErrors.name = "Name is required";
            isValid = false;
        }

        // Convert contact to string before validating if it's not already a string
        const contactStr = typeof contact === 'string' ? contact : String(contact);
        
        if (!contactStr || !contactStr.trim()) {
            formErrors.contact = "Contact is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(contactStr.trim())) {
            formErrors.contact = "Contact should be a 10-digit number";
            isValid = false;
        }

        if (!experience || !experience.trim()) {
            formErrors.experience = "Experience is required";
            isValid = false;
        }

        if (!address || !address.trim()) {
            formErrors.address = "Address is required";
            isValid = false;
        }

        if (!time || !time.trim()) {
            formErrors.time = "Time is required";
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        let data = {
            id: location.state.id,
            name: name,
            contact: contact,
            experience: experience,
            address: address,
            time: time
        };
        
        fetch('http://localhost:4000/ev/updatemech', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // Show success alert
                alert("Mechanic details updated successfully!");
                navigate('/');
            })
            .catch((err) => {
                console.log("Error updating mechanic:", err);
                alert("Failed to update mechanic details. Please try again.");
            });
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

        // Remove script when component unmounts
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
        <div>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-6 sm:px-12 font-sans">
                <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center animate-fade-in">Edit Mechanic Details</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
                            <input
                                id="name"
                                type="text"
                                className={`w-full px-4 py-3 mt-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contact" className="block text-sm font-semibold text-gray-700">Contact</label>
                            <input
                                id="contact"
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className={`w-full px-4 py-3 mt-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                            />
                            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="experience" className="block text-sm font-semibold text-gray-700">Experience</label>
                            <input
                                id="experience"
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className={`w-full px-4 py-3 mt-2 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                            />
                            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-semibold text-gray-700">Address</label>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`w-full px-4 py-3 mt-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="time" className="block text-sm font-semibold text-gray-700">Time</label>
                            <input
                                id="time"
                                type="text"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className={`w-full px-4 py-3 mt-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                            />
                            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                                onClick={handleUpdate}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <style>{`
                    @keyframes fade-in {
                        0% { opacity: 0; transform: translateY(-10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    
                    .animate-fade-in {
                        animation: fade-in 0.6s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    )
}

export default EditMech