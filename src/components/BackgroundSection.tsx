import React from 'react';
import { Target, Users, Lightbulb, Award, ChevronRight } from 'lucide-react';

export const BackgroundSection: React.FC = () => {
  const keyPoints = [
    {
      icon: Target,
      title: "Project Objective",
      description: "Develop a comprehensive AI-powered fullstack application with robust system architecture and intelligent features.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Target Audience", 
      description: "Enterprise clients seeking scalable AI solutions with modern web interfaces and seamless user experiences.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "Cutting-edge AI integration with traditional fullstack development methodologies for maximum impact.",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: Award,
      title: "Quality Standards",
      description: "Production-ready code with comprehensive testing, documentation, and deployment strategies.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="background" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Project Background
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              A comprehensive AI fullstack development project designed to showcase advanced system design, 
              innovative POC implementation, and production-ready development practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {keyPoints.map((point, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20 hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${point.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <point.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {point.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {point.description}
                </p>
                <div className="flex items-center mt-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to explore the system design?</h3>
                <p className="text-gray-300">Dive into the comprehensive architecture and technical specifications.</p>
              </div>
              <button 
                onClick={() => document.getElementById('system-design')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View System Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};