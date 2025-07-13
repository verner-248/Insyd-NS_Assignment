import React, { useState } from 'react';
import { CheckCircle, Clock, FileText, Code, Database, Rocket, Download, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [activeDeliverable, setActiveDeliverable] = useState(0);

  const deliverables = [
    {
      icon: FileText,
      title: "System Design Document",
      status: "Completed",
      description: "Comprehensive architecture documentation with diagrams and specifications",
      details: [
        "System architecture diagrams",
        "Database schema design",
        "API documentation",
        "Security implementation plan",
        "Deployment strategy"
      ],
      downloadable: true,
      size: "2.4 MB"
    },
    {
      icon: Code,
      title: "POC Application Code",
      status: "Completed",
      description: "Full source code with implementation examples and best practices",
      details: [
        "Frontend React application",
        "Backend API services",
        "Database migrations",
        "Unit and integration tests",
        "Docker configuration"
      ],
      downloadable: true,
      size: "8.7 MB"
    },
    {
      icon: Database,
      title: "Database Implementation",
      status: "Completed",
      description: "Production-ready database with optimized schema and sample data",
      details: [
        "PostgreSQL schema",
        "Sample data sets",
        "Migration scripts",
        "Performance indexes",
        "Backup procedures"
      ],
      downloadable: true,
      size: "1.2 MB"
    },
    {
      icon: Rocket,
      title: "Deployment Package",
      status: "In Progress",
      description: "Complete deployment guide with infrastructure as code",
      details: [
        "Docker Compose files",
        "CI/CD pipeline configuration",
        "Environment setup guides",
        "Monitoring configuration",
        "Scaling documentation"
      ],
      downloadable: false,
      estimatedCompletion: "Next week"
    }
  ];

  const milestones = [
    { phase: "Planning & Analysis", progress: 100, color: "bg-green-500" },
    { phase: "System Design", progress: 100, color: "bg-green-500" },
    { phase: "POC Development", progress: 85, color: "bg-blue-500" },
    { phase: "Testing & Documentation", progress: 60, color: "bg-yellow-500" },
    { phase: "Deployment & Delivery", progress: 25, color: "bg-orange-500" }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Project Deliverables
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Comprehensive project outputs including documentation, code, and deployment resources 
              for the AI fullstack development showcase.
            </p>
          </div>

          {/* Project Progress */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Project Progress Overview</h3>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{milestone.phase}</span>
                    <span className="text-gray-300">{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${milestone.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {deliverables.map((deliverable, index) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-500 cursor-pointer ${
                  activeDeliverable === index
                    ? 'border-green-400/50 bg-white/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => setActiveDeliverable(index)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 rounded-xl p-3 ${
                      deliverable.status === 'Completed'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500'
                        : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                    }`}>
                      <deliverable.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{deliverable.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{deliverable.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      deliverable.status === 'Completed'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      {deliverable.status === 'Completed' ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>In Progress</span>
                        </div>
                      )}
                    </span>
                    {deliverable.downloadable && (
                      <span className="text-gray-400 text-xs">{deliverable.size}</span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {activeDeliverable === index && (
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white">Included Components:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {deliverable.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                      {deliverable.downloadable ? (
                        <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                          <Download className="w-4 h-4" />
                          <span>Download Package</span>
                        </button>
                      ) : (
                        <div className="text-gray-400">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Available {deliverable.estimatedCompletion}
                        </div>
                      )}
                      
                      <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-3xl p-8 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Project Summary</h3>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              This AI Fullstack Software Developer showcase demonstrates comprehensive system design, 
              innovative POC development, and production-ready implementation following industry best practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                <span className="text-green-400 font-bold text-lg">4</span>
                <span className="text-gray-300 ml-2">Deliverables</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                <span className="text-blue-400 font-bold text-lg">85%</span>
                <span className="text-gray-300 ml-2">Complete</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                <span className="text-purple-400 font-bold text-lg">8 weeks</span>
                <span className="text-gray-300 ml-2">Timeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};