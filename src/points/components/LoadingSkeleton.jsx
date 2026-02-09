export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      {/* Leaderboard Skeleton */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="space-y-12 mt-16">
        {/* User Stats Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        {/* Referral Card Skeleton */}
        <div className="bg-gray-200 rounded-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-8 bg-gray-300 rounded w-32"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
