// src/components/sections/About.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Brush, Database, Server, Calendar, Briefcase, GraduationCap } from 'lucide-react';

const About = ({ language }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('skills');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'skills':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkillCategory 
              title={t('about.skillCategories.frontend')} 
              icon={<Code size={20} />}
              skills={[
                'React', 'Vue.js', 'JavaScript/TypeScript', 'HTML5/CSS3', 'Tailwind CSS'
              ]}
            />
            
            <SkillCategory 
              title={t('about.skillCategories.design')} 
              icon={<Brush size={20} />}
              skills={[
                'UI Design', 'UX Research', 'Figma', 'Design Systems', 'Interaction Design'
              ]}
            />
            
            <SkillCategory 
              title={t('about.skillCategories.backend')} 
              icon={<Server size={20} />}
              skills={[
                'Node.js', 'Python', 'RESTful APIs', 'Database Design', 'API Design'
              ]}
            />
            
            <SkillCategory 
              title={t('about.skillCategories.data')} 
              icon={<Database size={20} />}
              skills={[
                'Algorithms', 'Python', 'C++', 'Java', 'R', 'SQL', 'Statistics'
              ]}
            />
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-8">
            <ExperienceItem 
              period={t('about.experience.current.period')}
              title={t('about.experience.current.title')}
              company={t('about.experience.current.company')}
              description={t('about.experience.current.description')}
              current={true}
            />
            <ExperienceItem 
              period={t('about.experience.previous1.period')}
              title={t('about.experience.previous1.title')}
              company={t('about.experience.previous1.company')}
              description={t('about.experience.previous1.description')}
            />
          </div>
        );
      case 'education':
        return (
          <div className="space-y-8">
            <EducationItem 
              period={t('about.education.bachelors.period')}
              degree={t('about.education.bachelors.degree')}
              school={t('about.education.bachelors.school')}
              description={t('about.education.bachelors.description')}
            />
            <EducationItem 
              period={t('about.education.courses.period')}
              degree={t('about.education.courses.degree')}
              school={t('about.education.courses.school')}
              description={t('about.education.courses.description')}
              ongoing={true}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "1.7s" }}></div>
        <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-float-x" 
             style={{ animationDelay: "0.9s" }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('about.title')}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-300">
            {t('about.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 md:p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('about.whoIAm')}
              </h3>
              
              <div className="space-y-4 text-gray-300">
                <p>{t('about.bioP1')}</p>
                <p>{t('about.bioP2')}</p>
                <p>{t('about.bioP3')}</p>
              </div>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Personal Details
              </h3>
              
              <ul className="space-y-4">
                <PersonalDetail 
                  label={t('about.personalDetails.name')} 
                  value="Beyazıt Barutçu" 
                />
                <PersonalDetail 
                  label={t('about.personalDetails.email')} 
                  value="beyazbarutcu@gmail.com" 
                />
                <PersonalDetail 
                  label={t('about.personalDetails.location')} 
                  value="Bursa, Türkiye" 
                />
              </ul>
              
              <a 
                href="mailto:beyazbarutcu@gmail.com" 
                className="mt-6 inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all hover:-translate-y-1 shadow-lg"
              >
                Contact Me
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
              <div className="flex border-b border-gray-700/50">
                {[
                  { id: 'skills', label: t('about.tabs.skills') },
                  { id: 'experience', label: t('about.tabs.experience') },
                  { id: 'education', label: t('about.tabs.education') }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`flex-1 py-4 px-4 text-center transition-colors about-tab-button ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-white font-medium'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="p-6 md:p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// SkillCategory component with hover effects removed
const SkillCategory = ({ title, icon, skills }) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-5 shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-gradient-to-br from-orange-500/30 to-orange-500/10 rounded-full text-orange-400 shadow-md shadow-orange-900/10">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <span 
            key={index}
            className="px-3 py-1.5 bg-gradient-to-br from-gray-700/80 to-gray-800/80 text-gray-200 rounded-lg text-sm border border-gray-600/50 shadow-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

// Updated ExperienceItem with perfectly centered circle indicator
const ExperienceItem = ({ period, title, company, description, current = false }) => {
  return (
    <div className="relative pl-12">
      {/* Timeline line with consistent width and centered positioning */}
      <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/80 via-orange-500/50 to-orange-500/20"></div>
      
      {/* Circle indicator precisely centered on the line */}
      <div className="absolute left-[12px] top-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 border-2 border-orange-500 transform -translate-x-1/2 z-10 shadow-[0_0_8px_rgba(249,115,22,0.5)]">
        <Briefcase size={12} className="text-orange-400" />
      </div>
      
      <div className="flex items-center space-x-2 mb-3">
        <Calendar size={14} className="text-orange-400" />
        <div className="text-sm text-gray-300 font-medium">{period}</div>
        {current && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            Current
          </span>
        )}
      </div>
      
      <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
      <div className="text-orange-400 font-medium mb-3">{company}</div>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

// Updated EducationItem with elegant vertical line styling to match ExperienceItem
const EducationItem = ({ period, degree, school, description, ongoing = false }) => {
  return (
    <div className="relative pl-12">
      {/* Timeline line with elegant styling */}
      <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/80 via-blue-500/50 to-blue-500/20"></div>
      
      {/* Circle indicator with glow effect */}
      <div className="absolute left-[12px] top-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 border-2 border-blue-500 transform -translate-x-1/2 z-10 shadow-[0_0_8px_rgba(96,165,250,0.5)]">
        <GraduationCap size={12} className="text-blue-400" />
      </div>
      
      <div className="flex items-center space-x-2 mb-3">
        <Calendar size={14} className="text-blue-400" />
        <div className="text-sm text-gray-300 font-medium">{period}</div>
        {ongoing && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Ongoing
          </span>
        )}
      </div>
      
      <h4 className="text-xl font-semibold text-white mb-2">{degree}</h4>
      <div className="text-blue-400 font-medium mb-3">{school}</div>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

const PersonalDetail = ({ label, value }) => {
  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-0">
      <span className="text-gray-400">{label}:</span>
      <span className="text-gray-300 font-medium">{value}</span>
    </li>
  );
};

export default About;