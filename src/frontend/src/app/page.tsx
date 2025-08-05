export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Welcome to OpenCTF</h1>
      <p className="text-gray-600 mb-8">
        The comprehensive platform for Capture The Flag competitions.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Teams</h2>
          <p className="text-gray-600">Manage CTF teams and rankings</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Contests</h2>
          <p className="text-gray-600">Participate in competitions</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-gray-600">Individual player rankings</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Forum</h2>
          <p className="text-gray-600">Community discussions</p>
        </div>
      </div>
    </div>
  )
}
