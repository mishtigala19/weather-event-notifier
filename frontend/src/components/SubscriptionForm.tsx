"use client";
import React, { useState } from 'react';
import { api, SubscriptionData } from '@/lib/api';

interface SubscriptionFormProps {
  onSuccess?: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SubscriptionData>({
    email: '',
    phone: '',
    location: {
      city: '',
      country: 'US'
    },
    alertTypes: [],
    notificationMethods: [],
    frequency: 'once'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const alertTypeOptions = [
    { value: 'rain', label: '🌧️ Rain', description: 'Get notified about rain conditions' },
    { value: 'heat', label: '🌡️ Heat', description: 'High temperature warnings' },
    { value: 'storm', label: '⛈️ Storm', description: 'Thunderstorm and severe weather alerts' },
    { value: 'snow', label: '❄️ Snow', description: 'Snow and winter weather alerts' },
    { value: 'wind', label: '💨 Wind', description: 'High wind speed warnings' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SubscriptionData] as object,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'alertTypes' | 'notificationMethods') => {
    const { value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Validation
    if (!formData.email || !formData.phone || !formData.location.city) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    if (formData.alertTypes.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one alert type' });
      setIsSubmitting(false);
      return;
    }

    if (formData.notificationMethods.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one notification method' });
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
          email: '',
          phone: '',
          location: { city: '', country: 'US' },
          alertTypes: [],
          notificationMethods: [],
          frequency: 'once'
        });
        
        onSuccess?.();
      } else {
        setMessage({ 
          type: 'error', 
          text: response.errors?.join(', ') || response.error || 'Failed to create subscription' 
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
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Boston"
              />
            </div>

            <div>
              <label htmlFor="location.country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="location.country"
                name="location.country"
                value={formData.location.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="US"
              />
            </div>
          </div>
        </div>

        {/* Alert Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Alert Types *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alertTypeOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={formData.alertTypes.includes(option.value as any)}
                  onChange={(e) => handleCheckboxChange(e, 'alertTypes')}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notification Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Notification Methods *</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                value="email"
                checked={formData.notificationMethods.includes('email')}
                onChange={(e) => handleCheckboxChange(e, 'notificationMethods')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">📧 Email notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                value="sms"
                checked={formData.notificationMethods.includes('sms')}
                onChange={(e) => handleCheckboxChange(e, 'notificationMethods')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">📱 SMS notifications</span>
            </label>
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Alert Frequency</h3>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="once">One-time alerts</option>
            <option value="daily">Daily alerts</option>
            <option value="weekly">Weekly alerts</option>
          </select>
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