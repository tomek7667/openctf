'use client'

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to <span className="text-blue-600">OpenCTF</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The comprehensive platform for Capture The Flag competitions.
          Track teams, manage competitions, and build the cybersecurity community.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/teams"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Explore Teams →
          </a>
          <a
            href="/contests"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            View Competitions
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Active Teams</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">1.2K+</div>
            <div className="text-gray-600">Registered Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">Competitions</div>
          </div>
        </div>
      </section>
    </div>
  )
}
