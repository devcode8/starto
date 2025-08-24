import Link from 'next/link';
import { ArrowRight, Lightbulb, Presentation, Code, MessageSquare, Sparkles, TrendingUp, Users, Rocket, CheckCircle, Star, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-sm border border-white/20">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Powered by GPT-5</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Starto</span>
            </h1>

            {/* Tagline */}
            <p className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-6">
              From idea spark to investor-ready startup.
            </p>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transform your startup idea into a complete business package with AI-powered validation, 
              investor-ready pitch decks, and personalized tech stack recommendations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/chat"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <Rocket className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Launch Your Idea
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold border border-white/20 shadow-lg">
                <Users className="mr-2 h-5 w-5" />
                2,400+ Ideas Validated
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
                <div className="text-sm text-gray-600">Average completion time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-sm text-gray-600">User satisfaction rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$2.4B</div>
                <div className="text-sm text-gray-600">Total market size analyzed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial idea validation to investor presentations and technical guidance - 
              all powered by advanced AI in one seamless conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Idea Validator */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-green-200/50">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Idea Validator</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Comprehensive market research with TAM/SAM/SOM analysis, competitor insights, and validation scoring.
              </p>
              <Link 
                href="/chat" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold group/link"
              >
                Start Validating
                <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Pitch Builder */}
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-purple-200/50">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Presentation className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Pitch Builder</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Professional 6-slide investor presentations with compelling narratives and email templates.
              </p>
              <Link 
                href="/chat" 
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group/link"
              >
                Create Pitch Deck
                <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Tech Stack Guide */}
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-orange-200/50">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Tech Stack Guide</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Personalized technology recommendations with cost analysis and implementation timelines.
              </p>
              <Link 
                href="/chat" 
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group/link"
              >
                Get Tech Guide
                <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Q&A Assistant */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-blue-200/50">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Q&A Assistant</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Ask strategic questions about funding, marketing, competition, and technical challenges.
              </p>
              <Link 
                href="/chat" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group/link"
              >
                Ask Questions
                <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to transform your idea into a complete startup package
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Line - positioned to connect the step circles */}
              <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 z-0"></div>

              {/* Step 1 */}
              <div className="text-center relative z-10">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-blue-100">
                  <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Share Your Idea</h3>
                <p className="text-gray-600">
                  Tell us about your startup concept in natural conversation - no forms or complex inputs needed.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative z-10">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-purple-100">
                  <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Analysis</h3>
                <p className="text-gray-600">
                  Our GPT-5 AI analyzes your idea, researches the market, and creates comprehensive business materials.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative z-10">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-green-100">
                  <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Launch Ready</h3>
                <p className="text-gray-600">
                  Get validation reports, pitch decks, tech recommendations, and strategic guidance to move forward.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Starto?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save weeks of research and preparation with our intelligent, context-aware AI assistant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">Complete validation, pitch, and tech stack analysis in under 5 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Analysis</h3>
                <p className="text-gray-600 text-sm">Market research, competitive analysis, and technical recommendations in one place</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Investor Ready</h3>
                <p className="text-gray-600 text-sm">Professional pitch decks and materials ready for investor meetings</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 rounded-full p-3 flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
                <p className="text-gray-600 text-sm">TAM/SAM/SOM analysis, market validation scores, and growth projections</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 rounded-full p-3 flex-shrink-0">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">GPT-5 Powered</h3>
                <p className="text-gray-600 text-sm">Latest AI technology for accurate, contextual, and intelligent responses</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-pink-100 rounded-full p-3 flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Conversational Flow</h3>
                <p className="text-gray-600 text-sm">Natural chat interface with intelligent context retention across all modes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Turn Your Idea Into Reality?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of entrepreneurs who&apos;ve validated their ideas and built successful startups with AI guidance.
            </p>
            <Link 
              href="/chat"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-xl group"
            >
              <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Start Building Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
