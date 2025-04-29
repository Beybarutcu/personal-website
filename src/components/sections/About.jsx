// src/components/sections/About.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Brush, Database, Server } from 'lucide-react';

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
                { name: 'React', level: 90 },
                { name: 'Vue.js', level: 85 },
                { name: 'JavaScript/TypeScript', level: 95 },
                { name: 'HTML/CSS/SASS', level: 90 },
                { name: 'Tailwind CSS', level: 85 }
              ]}
            />
            
            <SkillCategory 
              title={t('about.skillCategories.design')} 
              icon={<Brush size={20} />}
              skills={[
                { name: 'UI/UX Design', level: 80 },
                { name: 'Figma', level: 85 },
                { name: 'Creative Visualization', level: 90 },
                { name: 'Animation', level: 75 },
                { name: 'Responsive Design', level: 90 }
              ]}
            />
            
            <SkillCategory 
              title={t('about.skillCategories.backend')} 
              icon={<Server size={20} />}
              skills={[
                { name: 'Node.js', level: 85 },
                { name: 'Python/Django', level: 80 },
                { name: 'RESTful APIs', level: 90 },
                { name: 'GraphQL', level: 75 },
                { name: 'Authentication', level: 85 }
              ]}
            />
            
            <SkillCategory 
              title={t('about.skillCategories.data')} 
              icon={<Database size={20} />}
              skills={[
                { name: 'D3.js', level: 95 },
                { name: 'Data Analysis', level: 85 },
                { name: 'Chart.js', level: 80 },
                { name: 'Python Data Science', level: 85 },
                { name: 'SQL/NoSQL', level: 80 }
              ]}
            />
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6">
            <ExperienceItem 
              period="2022 - Present"
              title="Senior Frontend Developer"
              company="Interactive Data Solutions"
              description="Leading frontend development for data visualization platforms with an emphasis on interactive user experiences. Implementing complex D3.js visualizations and optimizing performance for large datasets."
            />
            <ExperienceItem 
              period="2019 - 2022"
              title="UI/UX Developer"
              company="Creative Web Studio"
              description="Created responsive web applications with modern JavaScript frameworks. Designed and implemented interactive user interfaces focused on usability and accessibility."
            />
            <ExperienceItem 
              period="2017 - 2019"
              title="Web Developer"
              company="Digital Agency Inc."
              description="Developed websites and web applications for various clients. Worked on both frontend and backend technologies, focusing on creating seamless user experiences."
            />
          </div>
        );
      case 'education':
        return (
          <div className="space-y-6">
            <EducationItem 
              period="2015 - 2017"
              degree="Master's Degree in Computer Science"
              school="University of Technology"
              description="Specialized in AI and interactive visualization techniques. Thesis focused on neural network visualization methods for educational purposes."
            />
            <EducationItem 
              period="2011 - 2015"
              degree="Bachelor's Degree in Software Engineering"
              school="State Technical University"
              description="Core curriculum in programming, algorithms, data structures, and software development methodologies."
            />
            <EducationItem 
              period="Ongoing"
              degree="Professional Development"
              school="Various Online Platforms"
              description="Continuous learning through specialized courses in emerging web technologies, data visualization, and machine learning."
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Keep only the gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient orbs with a different color scheme */}
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
          {/* Bio section */}
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
                {t('about.personalDetails.name')}
              </h3>
              
              <ul className="space-y-4">
                <PersonalDetail 
                  label={t('about.personalDetails.name')} 
                  value="Your Name" 
                />
                <PersonalDetail 
                  label={t('about.personalDetails.email')} 
                  value="your.email@example.com" 
                />
                <PersonalDetail 
                  label={t('about.personalDetails.location')} 
                  value="City, Country" 
                />
                <PersonalDetail 
                  label={t('about.personalDetails.availability')} 
                  value="Available for Freelance" 
                />
              </ul>
              
              <a 
                href="#contact" 
                className="mt-6 inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all hover:-translate-y-1 shadow-lg"
              >
                {t('about.downloadResume')}
              </a>
            </div>
          </div>
          
          {/* Skills, Experience, Education tabs */}
          <div className="lg:col-span-7">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
              {/* Tabs */}
              <div className="flex border-b border-gray-700/50">
                {[
                  { id: 'skills', label: t('about.tabs.skills') },
                  { id: 'experience', label: t('about.tabs.experience') },
                  { id: 'education', label: t('about.tabs.education') }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`flex-1 py-4 px-4 text-center transition-colors ${
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
              
              {/* Tab content */}
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

// SkillCategory Component with Orange Highlight
const SkillCategory = ({ title, icon, skills }) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-5 transition-transform hover:transform hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-500/20 rounded-full text-orange-500">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{skill.name}</span>
              <span className="text-orange-400">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Experience Item Component
const ExperienceItem = ({ period, title, company, description }) => {
  return (
    <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-white/70 before:to-gray-600">
      <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-white transform -translate-x-1/2"></div>
      
      <div className="text-sm text-gray-400 mb-1">{period}</div>
      <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
      <div className="text-gray-300 mb-2">{company}</div>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

// Education Item Component
const EducationItem = ({ period, degree, school, description }) => {
  return (
    <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-white/70 before:to-gray-600">
      <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-white transform -translate-x-1/2"></div>
      
      <div className="text-sm text-gray-400 mb-1">{period}</div>
      <h4 className="text-lg font-semibold text-white mb-1">{degree}</h4>
      <div className="text-gray-300 mb-2">{school}</div>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

// Personal Detail Component
const PersonalDetail = ({ label, value }) => {
  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-0">
      <span className="text-gray-400">{label}:</span>
      <span className="text-gray-300 font-medium">{value}</span>
    </li>
  );
};

export default About;