import { useState , useEffect} from 'react';
import { Save, CheckCircle, AlertTriangle, RotateCcw, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

export default function EVConditionChecker() {
  // Form state
  const [formStep, setFormStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const navigate= useNavigate();
  const [formData, setFormData] = useState({
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      batteryCapacity: '',
    },
    batteryCondition: {
      rangeDecrease: '',
      chargingTime: '',
      batteryWarnings: 'no',
      lastBatteryCheck: '',
    },
    motorAndDrivetrain: {
      unusualNoises: 'no',
      acceleration: '',
      brakingRegeneration: '',
      motorWarnings: 'no',
    },
    electronics: {
      softwareUpdated: 'yes',
      displayIssues: 'no',
      sensorErrors: 'no',
      chargerCompatibility: 'yes',
    },
    chassis: {
      tireWear: '',
      suspensionNoises: 'no',
      bodyDamage: 'no',
      brakePadWear: '',
    }
  });
const [tailwindReady, setTailwindReady] = useState(false);
const handleBackClick = () => {
    navigate('/');
  };

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

  // Form sections
  const formSections = [
    {
      
      title: "Vehicle Information",
      fields: [
        { id: "make", label: "Vehicle Make", type: "text", section: "vehicleInfo" },
        { id: "model", label: "Vehicle Model", type: "text", section: "vehicleInfo" },
        { id: "year", label: "Vehicle Year", type: "number", section: "vehicleInfo" },
        { id: "mileage", label: "Current Mileage", type: "number", section: "vehicleInfo" },
        { id: "batteryCapacity", label: "Battery Capacity (kWh)", type: "number", section: "vehicleInfo" },
      ]
    },
    {
      title: "Battery Condition",
      fields: [
        { 
          id: "rangeDecrease", 
          label: "Range Decrease from Original", 
          type: "select", 
          section: "batteryCondition",
          options: [
            { value: "less-than-10", label: "Less than 10%" },
            { value: "10-20", label: "10-20%" },
            { value: "20-30", label: "20-30%" },
            { value: "more-than-30", label: "More than 30%" }
          ]
        },
        { 
          id: "chargingTime", 
          label: "Charging Time compared to when new", 
          type: "select", 
          section: "batteryCondition",
          options: [
            { value: "same", label: "Same as when new" },
            { value: "slightly-longer", label: "Slightly longer" },
            { value: "much-longer", label: "Much longer" }
          ]
        },
        { 
          id: "batteryWarnings", 
          label: "Any battery warning lights?", 
          type: "radio", 
          section: "batteryCondition",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        { 
          id: "lastBatteryCheck", 
          label: "Last Battery Diagnostic Check", 
          type: "select", 
          section: "batteryCondition",
          options: [
            { value: "within-6-months", label: "Within last 6 months" },
            { value: "6-12-months", label: "6-12 months ago" },
            { value: "more-than-12-months", label: "More than 12 months ago" },
            { value: "never", label: "Never" }
          ]
        },
      ]
    },
    {
      title: "Motor and Drivetrain",
      fields: [
        { 
          id: "unusualNoises", 
          label: "Unusual noises during operation?", 
          type: "radio", 
          section: "motorAndDrivetrain",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        { 
          id: "acceleration", 
          label: "Acceleration Performance", 
          type: "select", 
          section: "motorAndDrivetrain",
          options: [
            { value: "excellent", label: "Excellent - Same as when new" },
            { value: "good", label: "Good - Slight decrease" },
            { value: "fair", label: "Fair - Noticeable decrease" },
            { value: "poor", label: "Poor - Significant decrease" }
          ]
        },
        { 
          id: "brakingRegeneration", 
          label: "Regenerative Braking Performance", 
          type: "select", 
          section: "motorAndDrivetrain",
          options: [
            { value: "excellent", label: "Excellent" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "poor", label: "Poor" }
          ]
        },
        { 
          id: "motorWarnings", 
          label: "Any motor/powertrain warning lights?", 
          type: "radio", 
          section: "motorAndDrivetrain",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
      ]
    },
    {
      title: "Electronics and Software",
      fields: [
        { 
          id: "softwareUpdated", 
          label: "Software up to date?", 
          type: "radio", 
          section: "electronics",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        { 
          id: "displayIssues", 
          label: "Any issues with displays or interfaces?", 
          type: "radio", 
          section: "electronics",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        { 
          id: "sensorErrors", 
          label: "Any sensor errors or warnings?", 
          type: "radio", 
          section: "electronics",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        { 
          id: "chargerCompatibility", 
          label: "Compatible with modern charging stations?", 
          type: "radio", 
          section: "electronics",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
      ]
    },
    {
      title: "Chassis and Mechanical",
      fields: [
        { 
          id: "tireWear", 
          label: "Tire Wear", 
          type: "select", 
          section: "chassis",
          options: [
            { value: "excellent", label: "Excellent - Like new" },
            { value: "good", label: "Good - Some wear but plenty of tread" },
            { value: "fair", label: "Fair - Wearing thin" },
            { value: "poor", label: "Poor - Need replacement" }
          ]
        },
        { 
          id: "suspensionNoises", 
          label: "Any suspension noises?", 
          type: "radio", 
          section: "chassis",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        { 
          id: "bodyDamage", 
          label: "Any body damage or corrosion?", 
          type: "radio", 
          section: "chassis",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        { 
          id: "brakePadWear", 
          label: "Brake Pad Wear", 
          type: "select", 
          section: "chassis",
          options: [
            { value: "excellent", label: "Excellent - Like new" },
            { value: "good", label: "Good - Some wear" },
            { value: "fair", label: "Fair - Getting thin" },
            { value: "poor", label: "Poor - Need replacement" }
          ]
        },
      ]
    }
  ];

  // Handle form field changes
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Navigate through form steps
  const nextStep = () => {
    if (formStep < formSections.length - 1) {
      setFormStep(formStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    }
  };

  const resetForm = () => {
    setFormStep(0);
    setShowResults(false);
    setFormData({
      vehicleInfo: {
        make: '',
        model: '',
        year: '',
        mileage: '',
        batteryCapacity: '',
      },
      batteryCondition: {
        rangeDecrease: '',
        chargingTime: '',
        batteryWarnings: 'no',
        lastBatteryCheck: '',
      },
      motorAndDrivetrain: {
        unusualNoises: 'no',
        acceleration: '',
        brakingRegeneration: '',
        motorWarnings: 'no',
      },
      electronics: {
        softwareUpdated: 'yes',
        displayIssues: 'no',
        sensorErrors: 'no',
        chargerCompatibility: 'yes',
      },
      chassis: {
        tireWear: '',
        suspensionNoises: 'no',
        bodyDamage: 'no',
        brakePadWear: '',
      }
    });
  };

  // Analysis functions
  const getBatteryCondition = () => {
    const { rangeDecrease, chargingTime, batteryWarnings, lastBatteryCheck } = formData.batteryCondition;
    
    if (batteryWarnings === 'yes' || rangeDecrease === 'more-than-30') {
      return {
        status: 'bad',
        issues: [
          batteryWarnings === 'yes' ? 'Battery warning lights are active' : null,
          rangeDecrease === 'more-than-30' ? 'Significant range degradation (more than 30%)' : null,
          chargingTime === 'much-longer' ? 'Charging time has increased significantly' : null,
        ].filter(Boolean),
        recommendations: [
          'Schedule a comprehensive battery diagnostic test immediately',
          'Consider battery replacement or reconditioning',
          'Check battery cooling system for proper function',
          'Inspect charging system for potential issues'
        ]
      };
    } else if (rangeDecrease === '20-30' || chargingTime === 'much-longer' || lastBatteryCheck === 'never' || lastBatteryCheck === 'more-than-12-months') {
      return {
        status: 'fair',
        issues: [
          rangeDecrease === '20-30' ? 'Moderate range degradation (20-30%)' : null,
          chargingTime === 'much-longer' ? 'Charging time has increased significantly' : null,
          (lastBatteryCheck === 'never' || lastBatteryCheck === 'more-than-12-months') ? 'Battery diagnostics are overdue' : null,
        ].filter(Boolean),
        recommendations: [
          'Schedule a battery diagnostic check within the next month',
          'Consider adjusting charging habits (avoid frequent fast charging)',
          'Maintain battery charge between 20% and 80% for daily use',
          'Avoid extreme temperature exposure when possible'
        ]
      };
    } else {
      return {
        status: 'good',
        issues: [],
        recommendations: [
          'Continue current battery maintenance habits',
          'Schedule regular battery diagnostic checks every 6-12 months',
          'Maintain optimal charging practices (20-80% for daily use)',
          'Update battery management software when available'
        ]
      };
    }
  };

  const getDrivetrainCondition = () => {
    const { unusualNoises, acceleration, brakingRegeneration, motorWarnings } = formData.motorAndDrivetrain;
    
    if (motorWarnings === 'yes' || unusualNoises === 'yes' || acceleration === 'poor' || brakingRegeneration === 'poor') {
      return {
        status: 'bad',
        issues: [
          motorWarnings === 'yes' ? 'Motor/powertrain warning lights are active' : null,
          unusualNoises === 'yes' ? 'Unusual noises during operation' : null,
          acceleration === 'poor' ? 'Significant decrease in acceleration performance' : null,
          brakingRegeneration === 'poor' ? 'Poor regenerative braking performance' : null,
        ].filter(Boolean),
        recommendations: [
          'Schedule a comprehensive drivetrain diagnostic test immediately',
          'Have a professional EV technician inspect the motor and electronics',
          'Address any motor cooling system issues',
          'Check for firmware updates that might resolve motor control issues'
        ]
      };
    } else if (acceleration === 'fair' || brakingRegeneration === 'fair') {
      return {
        status: 'fair',
        issues: [
          acceleration === 'fair' ? 'Noticeable decrease in acceleration performance' : null,
          brakingRegeneration === 'fair' ? 'Fair regenerative braking performance' : null,
        ].filter(Boolean),
        recommendations: [
          'Schedule a drivetrain check-up in the next 1-2 months',
          'Ensure motor cooling systems are functioning properly',
          'Check and update motor control firmware if available',
          'Monitor for any changes in performance or unusual sounds'
        ]
      };
    } else {
      return {
        status: 'good',
        issues: [],
        recommendations: [
          'Continue regular maintenance checks of the drivetrain system',
          'Schedule annual professional inspections of the motor system',
          'Keep motor control software updated',
          'Monitor regenerative braking performance for any changes'
        ]
      };
    }
  };

  const getElectronicsCondition = () => {
    const { softwareUpdated, displayIssues, sensorErrors, chargerCompatibility } = formData.electronics;
    
    if (sensorErrors === 'yes' || (displayIssues === 'yes' && softwareUpdated === 'no')) {
      return {
        status: 'bad',
        issues: [
          sensorErrors === 'yes' ? 'Active sensor errors or warnings' : null,
          displayIssues === 'yes' ? 'Issues with displays or interfaces' : null,
          softwareUpdated === 'no' ? 'Software is out of date' : null,
          chargerCompatibility === 'no' ? 'Incompatible with modern charging stations' : null,
        ].filter(Boolean),
        recommendations: [
          'Schedule a comprehensive electronic diagnostic test immediately',
          'Update all vehicle software and firmware to latest versions',
          'Have sensor systems inspected and calibrated by a specialist',
          'Consider upgrading charging interface components if needed'
        ]
      };
    } else if (displayIssues === 'yes' || softwareUpdated === 'no' || chargerCompatibility === 'no') {
      return {
        status: 'fair',
        issues: [
          displayIssues === 'yes' ? 'Issues with displays or interfaces' : null,
          softwareUpdated === 'no' ? 'Software is out of date' : null,
          chargerCompatibility === 'no' ? 'Incompatible with modern charging stations' : null,
        ].filter(Boolean),
        recommendations: [
          'Update all vehicle software as soon as possible',
          'Have a technician inspect display systems',
          'Consider charging system upgrades for better compatibility',
          'Schedule regular software maintenance checks'
        ]
      };
    } else {
      return {
        status: 'good',
        issues: [],
        recommendations: [
          'Continue keeping software and firmware updated',
          'Periodically check for any new updates or patches',
          'Monitor charging compatibility with different charging networks',
          'Schedule annual electronics system check-ups'
        ]
      };
    }
  };

  const getChassisCondition = () => {
    const { tireWear, suspensionNoises, bodyDamage, brakePadWear } = formData.chassis;
    
    if (tireWear === 'poor' || brakePadWear === 'poor' || (suspensionNoises === 'yes' && bodyDamage === 'yes')) {
      return {
        status: 'bad',
        issues: [
          tireWear === 'poor' ? 'Tires need replacement' : null,
          brakePadWear === 'poor' ? 'Brake pads need replacement' : null,
          suspensionNoises === 'yes' ? 'Suspension noises present' : null,
          bodyDamage === 'yes' ? 'Body damage or corrosion present' : null,
        ].filter(Boolean),
        recommendations: [
          tireWear === 'poor' ? 'Replace tires immediately' : null,
          brakePadWear === 'poor' ? 'Replace brake pads immediately' : null,
          suspensionNoises === 'yes' ? 'Have suspension system professionally inspected' : null,
          bodyDamage === 'yes' ? 'Address body damage to prevent further corrosion' : null,
          'Schedule a comprehensive chassis inspection'
        ].filter(Boolean)
      };
    } else if (tireWear === 'fair' || brakePadWear === 'fair' || suspensionNoises === 'yes' || bodyDamage === 'yes') {
      return {
        status: 'fair',
        issues: [
          tireWear === 'fair' ? 'Tires showing significant wear' : null,
          brakePadWear === 'fair' ? 'Brake pads getting thin' : null,
          suspensionNoises === 'yes' ? 'Suspension noises present' : null,
          bodyDamage === 'yes' ? 'Body damage or corrosion present' : null,
        ].filter(Boolean),
        recommendations: [
          tireWear === 'fair' ? 'Plan for tire replacement in the next few months' : null,
          brakePadWear === 'fair' ? 'Plan for brake pad replacement soon' : null,
          suspensionNoises === 'yes' ? 'Have suspension system checked' : null,
          bodyDamage === 'yes' ? 'Address body damage to prevent corrosion' : null,
          'Schedule a chassis inspection in the next 3 months'
        ].filter(Boolean)
      };
    } else {
      return {
        status: 'good',
        issues: [],
        recommendations: [
          'Continue regular tire rotations and brake inspections',
          'Maintain regular inspection schedule for suspension components',
          'Conduct routine cleaning to prevent corrosion',
          'Schedule annual chassis inspection'
        ]
      };
    }
  };

  const getOverallCondition = () => {
    const batteryCondition = getBatteryCondition();
    const drivetrainCondition = getDrivetrainCondition();
    const electronicsCondition = getElectronicsCondition();
    const chassisCondition = getChassisCondition();
    
    const conditions = [
      batteryCondition.status,
      drivetrainCondition.status,
      electronicsCondition.status,
      chassisCondition.status
    ];
    
    if (conditions.includes('bad')) {
      return {
        status: 'bad',
        description: 'Your EV requires immediate attention in one or more critical systems.',
        recommendation: 'We recommend scheduling service as soon as possible to address the identified issues before continuing regular use of the vehicle.'
      };
    } else if (conditions.includes('fair')) {
      return {
        status: 'fair',
        description: 'Your EV is in fair condition with some areas that need attention.',
        recommendation: 'With proper maintenance and addressing the highlighted concerns, your vehicle should continue to serve you well.'
      };
    } else {
      return {
        status: 'good',
        description: 'Your EV is in good overall condition.',
        recommendation: 'Continue with regular maintenance and inspections to keep your vehicle in optimal condition.'
      };
    }
  };

  const downloadPDF = () => {
    const report = document.getElementById('evReport');
    
    html2canvas(report).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.setFontSize(20);
      pdf.text('EV Condition Report', pdfWidth / 2, 20, { align: 'center' });
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`EV-Condition-Report-${formData.vehicleInfo.make}-${formData.vehicleInfo.model}.pdf`);
    });
  };

  // Check if current section is valid for navigation
  const isCurrentSectionValid = () => {
    const currentSection = formSections[formStep];
    const sectionData = formData[currentSection.fields[0].section];
    
    return currentSection.fields.every(field => {
      const value = sectionData[field.id];
      return value !== undefined && value !== '';
    });
  };

  // Render form fields
  const renderField = (field) => {
    const { id, label, type, section, options } = field;
    const value = formData[section][id];
    
    switch (type) {
      case 'text':
      case 'number':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input
              type={type}
              value={value}
              onChange={(e) => handleChange(section, id, e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        );
      case 'select':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <select
              value={value}
              onChange={(e) => handleChange(section, id, e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select an option</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        );
      case 'radio':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <div className="flex space-x-4">
              {options.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${id}-${option.value}`}
                    name={id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => handleChange(section, id, option.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`${id}-${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render condition badges
  const ConditionBadge = ({ condition }) => {
    switch(condition) {
      case 'good':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" /> Good
          </span>
        );
      case 'fair':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <AlertTriangle className="w-4 h-4 mr-1" /> Fair
          </span>
        );
      case 'bad':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full">
            <AlertTriangle className="w-4 h-4 mr-1" /> Needs Attention
          </span>
        );
      default:
        return null;
    }
  };

  // Render the current form step
  const renderForm = () => {
    const currentSection = formSections[formStep];
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
            <button style={{color:"black",fontSize:"25px",fontWeight:"bold"}} onClick={handleBackClick}>←</button>

        <h2 className="text-xl font-bold mb-4">{currentSection.title}</h2>
        
        {currentSection.fields.map(field => renderField(field))}
        
        <div className="flex justify-between mt-6">
          {formStep > 0 && (
            <button
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Previous
            </button>
          )}
          <button
            onClick={nextStep}
            disabled={!isCurrentSectionValid()}
            className={`${isCurrentSectionValid() ? 'bg-blue-500 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {formStep === formSections.length - 1 ? 'Generate Report' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    const batteryCondition = getBatteryCondition();
    const drivetrainCondition = getDrivetrainCondition();
    const electronicsCondition = getElectronicsCondition();
    const chassisCondition = getChassisCondition();
    const overallCondition = getOverallCondition();
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md" id="evReport">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-center">EV Condition Report</h2>
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">Make:</span> {formData.vehicleInfo.make}</div>
              <div><span className="font-medium">Model:</span> {formData.vehicleInfo.model}</div>
              <div><span className="font-medium">Year:</span> {formData.vehicleInfo.year}</div>
              <div><span className="font-medium">Mileage:</span> {formData.vehicleInfo.mileage}</div>
              <div><span className="font-medium">Battery Capacity:</span> {formData.vehicleInfo.batteryCapacity} kWh</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Overall Condition:</h3>
              <ConditionBadge condition={overallCondition.status} />
            </div>
            <p className="mb-2">{overallCondition.description}</p>
            <p className="mb-2">{overallCondition.recommendation}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Battery System</h3>
              <ConditionBadge condition={batteryCondition.status} />
            </div>
            
            {batteryCondition.issues.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium">Issues:</h4>
                <ul className="list-disc list-inside">
                  {batteryCondition.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="list-disc list-inside">
                {batteryCondition.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Motor & Drivetrain</h3>
              <ConditionBadge condition={drivetrainCondition.status} />
            </div>
            
            {drivetrainCondition.issues.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium">Issues:</h4>
                <ul className="list-disc list-inside">
                  {drivetrainCondition.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
            )}
            
            <div>
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="list-disc list-inside">
                {drivetrainCondition.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Electronics & Software</h3>
              <ConditionBadge condition={electronicsCondition.status} />
            </div>
            
            {electronicsCondition.issues.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium">Issues:</h4>
                <ul className="list-disc list-inside">
                  {electronicsCondition.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="list-disc list-inside">
                {electronicsCondition.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Chassis & Mechanical</h3>
              <ConditionBadge condition={chassisCondition.status} />
            </div>
            
            {chassisCondition.issues.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium">Issues:</h4>
                <ul className="list-disc list-inside">
                  {chassisCondition.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="list-disc list-inside">
                {chassisCondition.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 justify-center mt-8">
          <button
            onClick={resetForm}
            className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Start Over
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <FileText className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">EV Vehicle Condition Checker</h1>
          <p className="text-gray-600">Answer a few questions to evaluate your electric vehicle's condition</p>
        </div>
        
        {!showResults ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center">
                {formSections.map((section, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep >= index ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {index + 1}
                    </div>
                    {index < formSections.length - 1 && (
                      <div className={`h-1 w-16 ${formStep > index ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {renderForm()}
          </div>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
}