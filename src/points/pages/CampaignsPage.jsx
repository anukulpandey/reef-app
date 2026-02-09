import { useState, useEffect } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Navbar from "../components/Dashboard/Navbar";
import CampaignTable from "../components/Dashboard/CampaignTable";
import CreateCampaignModal from "../components/Dashboard/CreateCampaignModal";
import { Plus } from "lucide-react";
import Uik from "@reef-chain/ui-kit";
import apiService from "../api/apiService";

const CampaignsPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchCampaigns = async (
    page = 1,
    limit = pagination.limit,
    isInitialLoad = false
  ) => {
    if (isInitialLoad) {
      setIsLoading(true);
    }
    setFetchError(null);
    try {
      const response = await apiService.getCampaigns(page, limit);
      console.log("🚀 ~ fetchCampaigns ~ response:", response);

      if (response && response.data) {
        setCampaigns(response.data);
        setPagination({
          page: parseInt(response.pagination.page),
          limit: parseInt(response.pagination.limit),
          totalCount: response.pagination.totalCount,
          totalPages: response.pagination.totalPages,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev,
        });
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch campaigns");
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCampaigns(1, pagination.limit, true); // Initial load
  }, []);

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= pagination.totalPages &&
      newPage !== pagination.page
    ) {
      fetchCampaigns(newPage, pagination.limit, false); // Page change, not initial load
    }
  };

  const handleItemsPerPageChange = (newLimit) => {
    if (newLimit !== pagination.limit) {
      const newPagination = { ...pagination, limit: newLimit };
      setPagination(newPagination);
      // Reset to page 1 when changing page size
      fetchCampaigns(1, newLimit, false); // Page size change, not initial load
    }
  };

  // Open modal for create
  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setIsCreateModalOpen(true);
  };

  // Open modal for edit
  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setIsCreateModalOpen(true);
  };

  // Add or update campaign
  const handleSaveCampaign = async (campaignData) => {
    try {
      console.log("Saving campaign data:", campaignData);

      // Always refresh campaigns from API after successful save
      // since the API call was already made in the modal
      await fetchCampaigns(pagination.page, pagination.limit, false);

      console.log("Campaigns refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh campaigns after save:", error);
    } finally {
      setEditingCampaign(null);
      setIsCreateModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="lg:ml-64 sm:pt-[7rem] pt-[11rem] p-4">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                All Campaigns
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Manage all your marketing campaigns ({pagination.totalCount}{" "}
                total pools)
              </p>
            </div>

            {/* Create Button with Bubble Effect */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="relative w-full sm:w-[12rem] h-[3rem] rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(90deg, #742cb2 0%, #ae27a5 100%)",
                }}
              >
                {/* Bubble effect background - positioned to fill button */}
                <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                  <Uik.Bubbles />
                </div>

                {/* Button content */}
                <button
                  onClick={handleCreateCampaign}
                  className="relative z-20 text-white w-full h-full rounded-2xl shadow-[0_5px_20px_-10px_#742cb2] font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm lg:text-base cursor-pointer bg-transparent border-none hover:shadow-[0_8px_30px_-12px_#742cb2]"
                >
                  <Plus className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span>Create Campaign</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-500 text-sm">
              Loading campaigns...
            </span>
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-500 py-8">{fetchError}</div>
        ) : (
          <CampaignTable
            campaigns={campaigns}
            onEditCampaign={handleEditCampaign}
            // Pagination props
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalCount}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showPageSizeSelector={true}
            showJumpToPage={true}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        )}

        {/* Create/Edit Campaign Modal */}
        <CreateCampaignModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onCreate={handleSaveCampaign}
          initialData={editingCampaign}
          isEdit={!!editingCampaign}
        />
      </main>
    </div>
  );
};

export default CampaignsPage;
