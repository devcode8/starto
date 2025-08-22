import Link from 'next/link';
import { Lightbulb, Presentation, Code, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Choose a module to get started with your startup journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/chat" className="group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group-hover:scale-105 transition-transform">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Idea Validator</h3>
              <p className="text-gray-600 mb-6">
                Validate your business idea with comprehensive market research, competitor analysis, 
                and market sizing estimates.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                Start Validation <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group-hover:scale-105 transition-transform">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Presentation className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Pitch Builder</h3>
              <p className="text-gray-600 mb-6">
                Generate professional pitch decks, investor materials, and outreach templates 
                automatically.
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                Build Pitch <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group-hover:scale-105 transition-transform">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Code className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Prototype Scaffolder</h3>
              <p className="text-gray-600 mb-6">
                Get technical architecture, code scaffolds, and implementation guidance for 
                your product.
              </p>
              <div className="flex items-center text-orange-600 font-medium">
                Create Prototype <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Startup Package</h2>
          <p className="text-gray-700 mb-4">
            For the best results, use all three modules in sequence:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>Validate</strong> your idea and understand the market</li>
            <li><strong>Build</strong> a compelling pitch deck for investors</li>
            <li><strong>Create</strong> technical prototypes and architecture</li>
          </ol>
        </div>
      </div>
    </div>
  );
}