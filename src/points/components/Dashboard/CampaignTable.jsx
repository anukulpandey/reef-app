import { Edit, Calendar } from "lucide-react";
import Pagination from "../common/Pagination";

const CampaignTable = ({
  campaigns,
  onEditCampaign,
  // Pagination props
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showPageSizeSelector = true,
  showJumpToPage = true,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const getStatusBadge = (isEligible, label) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          isEligible
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {isEligible ? `${label} Eligible` : `${label} Not Eligible`}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActiveSeasons = (campaign) => {
    const activeSeasons = [];
    if (campaign.bootstrappingEligible) activeSeasons.push("Bootstrapping");
    if (campaign.earlySznEligible) activeSeasons.push("Early Season");
    if (campaign.memeSznEligible) activeSeasons.push("Meme Season");

    return activeSeasons.length > 0
      ? activeSeasons.join(", ")
      : "No Active Seasons";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header with gradient */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Campaign</h3>
          <div className="text-sm text-gray-600">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""} shown
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pool Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Seasons
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bootstrapping
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Early Season
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meme Season
              </th>
              {onEditCampaign && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr
                key={campaign.poolAddress}
                className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300 border-b border-gray-100 last:border-b-0"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        campaign.isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {campaign.token0Symbol?.charAt(0) || "P"}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.token0Symbol}/{campaign.token1Symbol}
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.poolAddress.substring(0, 8)}...
                        {campaign.poolAddress.substring(
                          campaign.poolAddress.length - 6
                        )}
                      </div>
                      <span
                        className={`inline-flex mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {campaign.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getActiveSeasons(campaign)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1 flex flex-col gap-1 items-start">
                    {getStatusBadge(
                      campaign.bootstrappingEligible,
                      "Bootstrap"
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(campaign.bootstrappingStartDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1 flex flex-col gap-1 items-start">
                    {getStatusBadge(campaign.earlySznEligible, "Early")}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(campaign.earlySznStartDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1 flex flex-col gap-1 items-start">
                    {getStatusBadge(campaign.memeSznEligible, "Meme")}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(campaign.memeSznStartDate)}
                    </div>
                  </div>
                </td>
                {onEditCampaign && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center">
                      <div className="flex flex-col items-center group">
                        <button
                          className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded transition-colors"
                          onClick={() => onEditCampaign(campaign)}
                        >
                          <Edit className="w-4 h-4 cursor-pointer" />
                        </button>
                        <span className="text-xs mt-1 text-purple-600 group-hover:text-purple-800 transition-colors">
                          Edit
                        </span>
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state when no campaigns */}
      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            No campaigns found
          </h3>
          <p className="text-sm text-gray-500">
            There are no campaigns to display at the moment.
          </p>
        </div>
      )}

      {/* Integrated Pagination - only show if we have pagination data */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            showPageSizeSelector={showPageSizeSelector}
            showJumpToPage={showJumpToPage}
            pageSizeOptions={pageSizeOptions}
            className="border-0 rounded-none rounded-b-xl"
          />
        </div>
      )}
    </div>
  );
};

export default CampaignTable;
