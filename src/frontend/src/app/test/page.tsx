'use client'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Test Page</h1>
      <p className="text-gray-600">If you can see this, the app is working!</p>
      <button
        onClick={() => alert('Button works!')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Button
      </button>
    </div>
  )
}
