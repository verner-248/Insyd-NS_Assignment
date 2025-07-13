import React, { useState } from 'react';
import { Lightbulb, Code, Shield, Zap, Database, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const TipsSection: React.FC = () => {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const tips = [
    {
      icon: Code,
      category: "Development",
      title: "Clean Code Practices",
      summary: "Implement SOLID principles and maintain consistent coding standards",
      details: [
        "Use descriptive variable and function names",
        "Keep functions small and focused on single responsibility",
        "Implement proper error handling and logging",
        "Write comprehensive unit and integration tests",
        "Follow consistent code formatting and linting rules"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      category: "Security",
      title: "Security Best Practices",
      summary: "Implement robust security measures throughout the application",
      details: [
        "Use HTTPS everywhere and implement proper SSL/TLS",
        "Sanitize all user inputs to prevent injection attacks",
        "Implement proper authentication and authorization",
        "Keep dependencies updated and scan for vulnerabilities",
        "Use environment variables for sensitive configuration"
      ],
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Database,
      category: "Performance",
      title: "Database Optimization",
      summary: "Optimize database queries and implement efficient data structures",
      details: [
        "Create proper indexes for frequently queried columns",
        "Use connection pooling to manage database connections",
        "Implement caching strategies for expensive queries",
        "Normalize database schema appropriately",
        "Monitor query performance and optimize slow queries"
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Zap,
      category: "Performance",
      title: "Frontend Optimization",
      summary: "Enhance user experience with performance optimizations",
      details: [
        "Implement lazy loading for images and components",
        "Use code splitting to reduce initial bundle size",
        "Optimize images and use appropriate formats",
        "Implement service workers for offline functionality",
        "Monitor Core Web Vitals and performance metrics"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      category: "UX/UI",
      title: "User Experience Design",
      summary: "Create intuitive and accessible user interfaces",
      details: [
        "Follow accessibility guidelines (WCAG) for inclusive design",
        "Implement responsive design for all screen sizes",
        "Use consistent design patterns and components",
        "Provide clear feedback for user actions",
        "Conduct user testing and iterate based on feedback"
      ],
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Lightbulb,
      category: "Architecture",
      title: "Scalable Architecture",
      summary: "Design systems that can grow with your application needs",
      details: [
        "Use microservices architecture for complex applications",
        "Implement proper logging and monitoring",
        "Design for horizontal scaling from the beginning",
        "Use containerization for consistent deployments",
        "Plan for disaster recovery and backup strategies"
      ],
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const toggleTip = (index: number) => {
    setExpandedTip(expandedTip === index ? null : index);
  };

  return (
    <section id="tips" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Development Tips & Best Practices
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Essential guidelines and proven strategies for building robust, scalable, 
              and maintainable AI-powered applications.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleTip(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tip.color} p-3 flex-shrink-0`}>
                      <tip.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${tip.color} text-white`}>
                          {tip.category}
                        </span>
                        <ArrowRight 
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                            expandedTip === index ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-yellow-300 transition-colors">
                        {tip.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {tip.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <div className={`overflow-hidden transition-all duration-500 ${
                  expandedTip === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Implementation Guidelines:</h4>
                      <div className="space-y-3">
                        {tip.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to implement these practices?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Explore the deliverables section to see how these tips are applied in the actual project implementation.
              </p>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View Deliverables
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};