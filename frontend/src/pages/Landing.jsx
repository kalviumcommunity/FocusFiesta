import React from "react";
import { Link } from "react-router-dom";


export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Navigation */}
      <nav className="w-full px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-900">FocusFiesta</div>
          <div className="flex gap-4">
            <Link 
              to="/login"
              className="px-6 py-2 text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black text-blue-900 mb-8 leading-tight">
            Focus Better.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Work Smarter.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-700 mb-12 leading-relaxed max-w-3xl mx-auto">
            Professional productivity platform powered by proven Pomodoro techniques. 
            Transform your workflow, boost focus, and achieve exceptional results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              onClick={() => console.log('Start trial')}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link 
              onClick={() => console.log('Watch demo')}
              className="px-8 py-4 border-2 border-blue-300 text-blue-700 text-lg font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Smart Timing</h3>
            <p className="text-blue-700 text-lg leading-relaxed">
              Adaptive Pomodoro sessions that learn from your work patterns and optimize for peak productivity.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Deep Analytics</h3>
            <p className="text-blue-700 text-lg leading-relaxed">
              Comprehensive insights into your productivity patterns with actionable recommendations for improvement.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Team Sync</h3>
            <p className="text-blue-700 text-lg leading-relaxed">
              Seamless collaboration tools that keep teams aligned and productive across all projects.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/60 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-16">
            Trusted by professionals worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-black text-blue-900 mb-2">50K+</div>
              <div className="text-blue-700 text-lg">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-black text-blue-900 mb-2">75%</div>
              <div className="text-blue-700 text-lg">Productivity Boost</div>
            </div>
            <div>
              <div className="text-5xl font-black text-blue-900 mb-2">99.9%</div>
              <div className="text-blue-700 text-lg">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of professionals who have already revolutionized their workflow.
          </p>
          <Link 
            onClick={() => console.log('Start free trial')}
            className="px-10 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="text-2xl font-bold text-blue-900 mb-4">FocusFiesta</div>
          <p className="text-blue-700">
            Professional productivity platform for modern teams.
          </p>
        </div>
      </footer>
    </div>
  );
}