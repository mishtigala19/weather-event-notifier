"use client";
import React, { useState } from 'react';
import { api, SubscriptionData } from '@/lib/api';

interface SubscriptionFormProps {
  onSuccess?: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    location: '',
    alertType: 'rain' as 'rain' | 'heat' | 'storm' | 'snow' | 'wind',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const alertTypeOptions = [
    { value: 'rain', label: '🌧️ Rain Alert', description: 'Get notified about rain conditions' },
    { value: 'heat', label: '🌡️ Heat Warning', description: 'High temperature warnings' },
    { value: 'storm', label: '⛈️ Storm Alert', description: 'Thunderstorm and severe weather alerts' },
    { value: 'snow', label: '❄️ Snow Alert', description: 'Snow and winter weather alerts' },
    { value: 'wind', label: '💨 Wind Warning', description: 'High wind speed warnings' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Validation
    if (!formData.email || !formData.location) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.createSubscription(formData);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Successfully subscribed to weather alerts! You will receive notifications based on your preferences.' 
        });
        
        // Reset form
        setFormData({
          location: '',
          alertType: 'rain',
          email: '',
          phone: ''
        });
        
        onSuccess?.();
      } else {
        setMessage({ 
          type: 'error', 
          text: response.error || 'Failed to create subscription' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Subscribe to Weather Alerts
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Boston"
          />
          <p className="mt-1 text-sm text-gray-500">Enter your city name</p>
        </div>

        {/* Alert Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Alert Type *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alertTypeOptions.map((option) => (
              <label 
                key={option.value} 
                className={`flex items-start space-x-3 p-3 border rounded-md cursor-pointer transition-colors ${
                  formData.alertType === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="alertType"
                  value={option.value}
                  checked={formData.alertType === option.value}
                  onChange={handleInputChange}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
            <p className="mt-1 text-sm text-gray-500">Include country code for SMS alerts</p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? 'Creating Subscription...' : 'Subscribe to Weather Alerts'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          By subscribing, you agree to receive weather alerts. 
          You can unsubscribe at any time using the link in our notifications.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionForm;