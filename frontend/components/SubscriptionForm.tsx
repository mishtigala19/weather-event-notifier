'use client';

import React, { useState } from 'react';

interface FormData {
  email: string;
  phone: string;
  city: string;
  alertTypes: string[];
  frequency: string;
  preferredMethod: string;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

export default function SubscriptionForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    city: '',
    alertTypes: [],
    frequency: 'daily',
    preferredMethod: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        alertTypes: checkbox.checked 
          ? [...prev.alertTypes, value]
          : prev.alertTypes.filter(type => type !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages and start loading
    setMessage(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3001/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          alertTypes: formData.alertTypes,
          frequency: formData.frequency,
          preferredMethod: formData.preferredMethod
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Successfully subscribed to weather alerts! You will receive notifications based on your preferences.'
        });
        // Reset form on success
        setFormData({
          email: '',
          phone: '',
          city: '',
          alertTypes: [],
          frequency: 'daily',
          preferredMethod: 'email'
        });
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to subscribe. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Subscribe to Weather Alerts
      </h2>

      {/* Success/Error Banner */}
      {message && (
        <div 
          className={`mb-6 px-4 py-3 rounded-lg border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : 'bg-red-50 border-red-400 text-red-700'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            required
          />
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            required
          />
        </div>

        {/* City Input */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            required
          />
        </div>

        {/* Alert Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alert Types
          </label>
          <div className="space-y-2">
            {['rain', 'heat', 'storm'].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={type}
                  name="alertTypes"
                  value={type}
                  checked={formData.alertTypes.includes(type)}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                    isSubmitting ? 'cursor-not-allowed' : ''
                  }`}
                />
                <label htmlFor={type} className="ml-2 block text-sm text-gray-900 capitalize">
                  {type} Alerts
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
            Alert Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="immediate">Immediate</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {/* Preferred Method */}
        <div>
          <label htmlFor="preferredMethod" className="block text-sm font-medium text-gray-700">
            Preferred Notification Method
          </label>
          <select
            id="preferredMethod"
            name="preferredMethod"
            value={formData.preferredMethod}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Enhanced Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Subscribing...
            </>
          ) : (
            'Subscribe to Weather Alerts'
          )}
        </button>
      </form>
    </div>
  );
}
