import React, { useState } from 'react';
import { Database, Server, Cloud, Shield, Zap, GitBranch, CheckCircle, Clock } from 'lucide-react';

export const SystemDesignSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const designComponents = [
    {
      icon: Database,
      title: "Database Architecture",
      description: "Scalable database design with optimized queries and data modeling",
      details: "PostgreSQL with Redis caching, automated backups, and horizontal scaling capabilities."
    },
    {
      icon: Server,
      title: "Backend Services",
      description: "Microservices architecture with API gateway and load balancing",
      details: "Node.js/Express.js backend with RESTful APIs, JWT authentication, and rate limiting."
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Modern cloud deployment with container orchestration",
      details: "Docker containers deployed on AWS/Azure with auto-scaling and monitoring."
    },
    {
      icon: Shield,
      title: "Security Layer",
      description: "Comprehensive security implementation and best practices",
      details: "OAuth 2.0, data encryption, CORS policies, and security auditing."
    }
  ];

  const deliverables = [
    {
      icon: CheckCircle,
      title: "System Architecture Diagram",
      status: "Completed",
      description: "Complete visual representation of system components and data flow"
    },
    {
      icon: CheckCircle,
      title: "Technical Specifications",
      status: "Completed", 
      description: "Detailed documentation of APIs, database schemas, and integrations"
    },
    {
      icon: Clock,
      title: "Performance Metrics",
      status: "In Progress",
      description: "Load testing results and optimization recommendations"
    },
    {
      icon: Clock,
      title: "Deployment Guide",
      status: "In Progress",
      description: "Step-by-step deployment and maintenance procedures"
    }
  ];

  const tabs = [
    { name: "Architecture", icon: GitBranch },
    { name: "Deliverables", icon: CheckCircle },
    { name: "Timeline", icon: Clock }
  ];

  return (
    <section id="system-design" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Part 1: System Design Document
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Comprehensive system architecture showcasing scalable, secure, and efficient design patterns 
              for modern AI-powered applications.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              <div className="flex space-x-2">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === index
                        ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture Tab */}
          {activeTab === 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {designComponents.map((component, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-teal-400/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 p-3 group-hover:scale-110 transition-transform duration-300">
                      <component.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                        {component.title}
                      </h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {component.description}
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {component.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Deliverables Tab */}
          {activeTab === 1 && (
            <div className="space-y-6">
              {deliverables.map((deliverable, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl p-3 ${
                        deliverable.status === 'Completed' 
                          ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                          : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                      }`}>
                        <deliverable.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{deliverable.title}</h3>
                        <p className="text-gray-300 text-sm">{deliverable.description}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      deliverable.status === 'Completed'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      {deliverable.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 2 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">Week 1-2: Requirements Analysis</h3>
                    <p className="text-gray-300">System requirements gathering and initial architecture planning</p>
                  </div>
                  <span className="text-green-400 font-semibold">Completed</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">Week 3-4: System Design</h3>
                    <p className="text-gray-300">Detailed architecture design and component specifications</p>
                  </div>
                  <span className="text-green-400 font-semibold">Completed</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">Week 5-6: Implementation</h3>
                    <p className="text-gray-300">Core system development and integration</p>
                  </div>
                  <span className="text-orange-400 font-semibold">In Progress</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">Week 7-8: Testing & Deployment</h3>
                    <p className="text-gray-300">Comprehensive testing and production deployment</p>
                  </div>
                  <span className="text-gray-400 font-semibold">Upcoming</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};