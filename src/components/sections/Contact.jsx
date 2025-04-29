// src/components/sections/Contact.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react';

// Custom X logo component for social links
const XLogo = ({ size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 4l11.5 16h4.5l-11.5 -16z" />
    <path d="M4 20l3 0" />
    <path d="M17 4l3 0" />
  </svg>
);

const Contact = ({ language }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({
      submitting: true,
      success: false,
      error: false
    });
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      
      // Simulate successful submission
      setFormStatus({
        submitting: false,
        success: true,
        error: false
      });
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    }, 1500);
  };
  
  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Keep only the gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient orbs with a different color scheme */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "0.2s" }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "1.1s" }}></div>
        <div className="absolute top-2/3 left-1/5 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl animate-float-x" 
             style={{ animationDelay: "0.8s" }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('contact.title')}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-300">
            {t('contact.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Information */}
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 md:p-8 shadow-xl transition-transform hover:transform hover:scale-[1.01]">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t('contact.contactInfo')}
              </h3>
              
              <div className="space-y-6">
                <ContactInfoItem 
                  icon={<Mail size={20} className="text-orange-500" />}
                  title={t('contact.infoDetails.email')}
                  content="your.email@example.com"
                  href="mailto:your.email@example.com"
                />
                
                <ContactInfoItem 
                  icon={<MapPin size={20} className="text-orange-500" />}
                  title={t('contact.infoDetails.location')}
                  content="City, Country"
                />
                
                <ContactInfoItem 
                  icon={<Phone size={20} className="text-orange-500" />}
                  title={t('contact.infoDetails.phone')}
                  content="+1 (555) 123-4567"
                  href="tel:+15551234567"
                />
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 md:p-8 shadow-xl transition-transform hover:transform hover:scale-[1.01]">
              <h3 className="text-xl font-semibold text-white mb-6">
                {t('contact.connectWithMe')}
              </h3>
              
              <div className="flex justify-center space-x-6">
                <SocialLink 
                  href="https://github.com/yourusername" 
                  icon={<Github size={20} />}
                  label="GitHub"
                />
                <SocialLink 
                  href="https://linkedin.com/in/yourusername" 
                  icon={<Linkedin size={20} />}
                  label="LinkedIn"
                />
                <SocialLink 
                  href="https://x.com/yourusername" 
                  icon={<XLogo size={20} />}
                  label="X (formerly Twitter)"
                />
              </div>
            </div>
            
            {/* Availability Status */}
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 md:p-8 shadow-xl transition-transform hover:transform hover:scale-[1.01]">
              <h3 className="text-xl font-semibold text-white mb-6">
                {t('contact.availableFor')}
              </h3>
              
              <div className="space-y-4">
                <AvailabilityItem 
                  label={t('contact.availabilityTypes.freelance')}
                  available={true}
                />
                <AvailabilityItem 
                  label={t('contact.availabilityTypes.fulltime')}
                  available={false}
                />
                <AvailabilityItem 
                  label={t('contact.availabilityTypes.collaborations')}
                  available={true}
                />
                <AvailabilityItem 
                  label={t('contact.availabilityTypes.consulting')}
                  available={true}
                />
              </div>
            </div>
          </div>
          
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 md:p-8 shadow-xl h-full">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t('contact.form.title')}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <FormInput
                    id="name"
                    name="name"
                    type="text"
                    label={t('contact.form.name')}
                    placeholder={t('contact.form.namePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  
                  {/* Email Input */}
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    label={t('contact.form.email')}
                    placeholder={t('contact.form.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                {/* Subject Input */}
                <FormInput
                  id="subject"
                  name="subject"
                  type="text"
                  label={t('contact.form.subject')}
                  placeholder={t('contact.form.subjectPlaceholder')}
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
                
                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400 resize-none input-highlight"
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`px-8 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg font-medium transition-all submit-button-highlight ${
                      formStatus.submitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:bg-orange-500/30 hover:-translate-y-1 shadow-lg'
                    }`}
                  >
                    {formStatus.submitting 
                      ? t('contact.form.sending') 
                      : t('contact.form.sendButton')
                    }
                  </button>
                </div>
                
                {/* Success/Error messages */}
                {formStatus.success && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                    {t('contact.form.successMessage')}
                  </div>
                )}
                
                {formStatus.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {t('contact.form.errorMessage')}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Form Input Component
const FormInput = ({ id, name, label, type = 'text', placeholder, value, onChange, required = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400 transition-colors input-highlight"
      />
    </div>
  );
};

// Contact Info Item Component with improved organization
const ContactInfoItem = ({ icon, title, content, href }) => {
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-3 bg-gray-700/50 rounded-full border border-gray-600/30 transition-all group-hover:bg-gray-600/50 flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <h4 className="text-orange-400 font-medium text-sm mb-2 text-left">{title}</h4>
        {href ? (
          <a href={href} className="text-white hover:text-gray-300 transition-colors text-left">
            {content}
          </a>
        ) : (
          <p className="text-white text-left">{content}</p>
        )}
      </div>
    </div>
  );
};

// Social Link Component with X logo
const SocialLink = ({ href, icon, label }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-gray-700/60 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

// Availability Item Component with colorful status
const AvailabilityItem = ({ label, available }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <span 
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          available 
            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
            : 'bg-gray-700/50 text-gray-400 border border-gray-600/50'
        }`}
      >
        {available ? 'Available' : 'Unavailable'}
      </span>
    </div>
  );
};

export default Contact;