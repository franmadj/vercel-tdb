export default function Loading() {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">Loading Order Details</h1>
          <p className="text-gray-600">Please wait while we retrieve your order information...</p>
        </div>
      </div>
    )
  }
  
  