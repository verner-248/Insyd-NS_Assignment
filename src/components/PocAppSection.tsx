import React, { useState } from 'react';
import { Sparkles, Zap, Brain, Rocket, Play, Code, Monitor, Smartphone } from 'lucide-react';

export const PocAppSection: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const pocFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Real-time data processing with machine learning insights",
      demo: "Interactive dashboard showing live AI predictions and data visualization"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant data processing and response generation",
      demo: "Live chat interface with AI responses and natural language processing"
    },
    {
      icon: Sparkles,
      title: "Smart Automation",
      description: "Intelligent workflow automation and optimization",
      demo: "Automated task management system with smart prioritization"
    },
    {
      icon: Rocket,
      title: "Scalable Architecture",
      description: "Built for enterprise-level performance and growth",
      demo: "Performance metrics showing system scalability and load handling"
    }
  ];

  const demoScreens = [
    {
      title: "Dashboard Overview",
      description: "Main analytics dashboard with real-time metrics",
      features: ["Live data visualization", "AI insights panel", "Performance monitoring"]
    },
    {
      title: "AI Chat Interface",
      description: "Intelligent conversation system with context awareness",
      features: ["Natural language processing", "Context retention", "Multi-language support"]
    },
    {
      title: "Automation Workflow",
      description: "Smart task automation and process optimization",
      features: ["Workflow builder", "Smart triggers", "Performance analytics"]
    },
    {
      title: "Analytics Engine",
      description: "Advanced analytics with predictive capabilities",
      features: ["Predictive modeling", "Trend analysis", "Custom reports"]
    }
  ];

  return (
    <section id="poc-app" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Part 2: POC Application
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Interactive proof-of-concept demonstrating AI integration, real-time processing, 
              and modern user experience design patterns.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pocFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-purple-400/50 cursor-pointer"
                onClick={() => setActiveDemo(index)}
              >
                <div className={`w-12 h-12 rounded-xl p-3 mb-4 transition-all duration-300 ${
                  activeDemo === index 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110' 
                    : 'bg-gradient-to-r from-purple-500/50 to-pink-500/50 group-hover:scale-105'
                }`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors ${
                  activeDemo === index ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
                }`}>
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Demo Showcase */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-3xl p-8 border border-white/10 mb-16">
            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Play className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Live Demo</h3>
                </div>
                <h4 className="text-xl font-semibold text-purple-300 mb-4">
                  {demoScreens[activeDemo].title}
                </h4>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {demoScreens[activeDemo].description}
                </p>
                <div className="space-y-2">
                  {demoScreens[activeDemo].features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 max-w-lg">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex space-x-2">
                      <Monitor className="w-4 h-4 text-gray-400" />
                      <Smartphone className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 h-64 flex items-center justify-center border border-purple-500/20">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mx-auto mb-4 animate-pulse">
                        {React.createElement(pocFeatures[activeDemo].icon, { className: "w-8 h-8 text-white" })}
                      </div>
                      <h5 className="text-white font-semibold mb-2">Interactive Demo</h5>
                      <p className="text-gray-300 text-sm">
                        {pocFeatures[activeDemo].demo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Navigation */}
          <div className="flex justify-center">
            <div className="flex space-x-2 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              {demoScreens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDemo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeDemo
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};