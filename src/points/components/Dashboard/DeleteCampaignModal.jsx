import { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const DeleteCampaignModal = ({ isOpen, onClose, onDelete, campaign }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the onDelete function passed from parent
      if (onDelete && campaign) {
        onDelete(campaign.id);
      }

      // Close modal after successful deletion
      onClose();

      // You could show a success toast here
      // alert("Campaign deleted successfully!");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      // alert("Failed to delete campaign. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  // Disable main page scroll when modal is open
  if (typeof window !== "undefined") {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Campaign
              </h2>
              <p className="text-sm text-gray-500">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete the campaign:
            </p>
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-400">
              <p className="font-medium text-gray-900">{campaign.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                Budget: ${campaign.budget?.toLocaleString() || "N/A"} • Status:{" "}
                {campaign.status}
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This will permanently delete all
              campaign data, including analytics, performance metrics, and
              associated files. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-6 sm:py-3 border min-h-[3.5rem] sm:min-h-[3rem] cursor-pointer border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer text-white px-6 py-6 sm:py-3 min-h-[3.5rem] sm:min-h-[3rem] rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-sm"
          >
            {isDeleting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent disabled:opacity-50 disabled:cursor-not-allowed rounded-full animate-spin mr-2"></div>
                Deleting...
              </div>
            ) : (
              <div className="flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Campaign
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCampaignModal;
