import { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, Search } from "lucide-react";
import apiService from "../../api/apiService";

const CreateCampaignModal = ({
  isOpen,
  onClose,
  onCreate,
  initialData,
  isEdit,
}) => {
  console.log("🚀 ~ CreateCampaignModal ~ initialData:", initialData);
  const [formData, setFormData] = useState({
    poolAddress: "",
    bootstrappingEligible: false,
    bootstrappingStartDate: "",
    earlySznEligible: false,
    earlySznStartDate: "",
    memeSznEligible: false,
    memeSznStartDate: "",
  });

  const [pools, setPools] = useState([]);
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPoolDropdownOpen, setIsPoolDropdownOpen] = useState(false);
  const [poolSearchQuery, setPoolSearchQuery] = useState("");

  // Helper functions
  const toDatetimeLocal = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 16);
  };

  const toISOString = (datetimeLocal) => {
    if (!datetimeLocal) return "";
    return new Date(datetimeLocal).toISOString();
  };

  // Fetch pools on mount
  useEffect(() => {
    if (isOpen) {
      fetchPools();
    }
  }, [isOpen]);

  // Initialize form data
  useEffect(() => {
    if (isOpen && initialData && isEdit) {
      setFormData({
        poolAddress: initialData.poolAddress || "",
        bootstrappingEligible: initialData.bootstrappingEligible || false,
        bootstrappingStartDate: toDatetimeLocal(
          initialData.bootstrappingStartDate
        ),
        earlySznEligible: initialData.earlySznEligible || false,
        earlySznStartDate: toDatetimeLocal(initialData.earlySznStartDate),
        memeSznEligible: initialData.memeSznEligible || false,
        memeSznStartDate: toDatetimeLocal(initialData.memeSznStartDate),
      });
    } else if (isOpen && !isEdit) {
      setFormData({
        poolAddress: "",
        bootstrappingEligible: false,
        bootstrappingStartDate: "",
        earlySznEligible: false,
        earlySznStartDate: "",
        memeSznEligible: false,
        memeSznStartDate: "",
      });
    }
  }, [isOpen, initialData, isEdit]);

  const fetchPools = async () => {
    setPoolsLoading(true);
    try {
      const response = await apiService.getPools();
      const poolsData = Array.isArray(response)
        ? response
        : response?.data || [];
      setPools(poolsData);
    } catch (error) {
      console.error("Failed to fetch pools:", error);
      setErrors({ general: "Failed to load pools" });
    } finally {
      setPoolsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.poolAddress) {
      newErrors.poolAddress = "Please select a pool";
    }

    if (
      !formData.bootstrappingEligible &&
      !formData.earlySznEligible &&
      !formData.memeSznEligible
    ) {
      newErrors.seasons = "At least one season must be enabled";
    }

    if (formData.bootstrappingEligible && !formData.bootstrappingStartDate) {
      newErrors.bootstrappingStartDate =
        "Start date is required for bootstrapping season";
    }

    if (formData.earlySznEligible && !formData.earlySznStartDate) {
      newErrors.earlySznStartDate = "Start date is required for early season";
    }

    if (formData.memeSznEligible && !formData.memeSznStartDate) {
      newErrors.memeSznStartDate = "Start date is required for meme season";
    }

    const now = new Date();
    if (
      formData.bootstrappingStartDate &&
      new Date(formData.bootstrappingStartDate) <= now
    ) {
      newErrors.bootstrappingStartDate = "Start date must be in the future";
    }

    if (
      formData.earlySznStartDate &&
      new Date(formData.earlySznStartDate) <= now
    ) {
      newErrors.earlySznStartDate = "Start date must be in the future";
    }

    if (
      formData.memeSznStartDate &&
      new Date(formData.memeSznStartDate) <= now
    ) {
      newErrors.memeSznStartDate = "Start date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Build the campaign object
      const campaignObject = { poolAddress: formData.poolAddress };

      if (formData.bootstrappingEligible) {
        campaignObject.bootstrappingEligible = true;
        campaignObject.bootstrappingStartDate = toISOString(
          formData.bootstrappingStartDate
        );
      }

      if (formData.earlySznEligible) {
        campaignObject.earlySznEligible = true;
        campaignObject.earlySznStartDate = toISOString(
          formData.earlySznStartDate
        );
      }

      if (formData.memeSznEligible) {
        campaignObject.memeSznEligible = true;
        campaignObject.memeSznStartDate = toISOString(
          formData.memeSznStartDate
        );
      }

      console.log("Campaign object:", campaignObject);

      // For create, send as array. For edit, send as single object
      if (isEdit && initialData?.poolAddress) {
        await apiService.updateCampaign(
          initialData.poolAddress,
          campaignObject
        );
      } else {
        // API expects array of campaign objects
        const campaignDataArray = [campaignObject];
        console.log("Sending campaign data array:", campaignDataArray);
        await apiService.createCampaign(campaignDataArray);
      }

      onCreate(campaignObject);
      handleClose();
    } catch (error) {
      console.error("Campaign submission error:", error);
      setErrors({
        general:
          error.message || `Failed to ${isEdit ? "update" : "create"} campaign`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      poolAddress: "",
      bootstrappingEligible: false,
      bootstrappingStartDate: "",
      earlySznEligible: false,
      earlySznStartDate: "",
      memeSznEligible: false,
      memeSznStartDate: "",
    });
    setErrors({});
    setIsPoolDropdownOpen(false);
    setPoolSearchQuery("");
    onClose();
  };

  const getSelectedPool = () => {
    return pools.find((pool) => pool.poolAddress === formData.poolAddress);
  };

  const filteredPools = pools.filter(
    (pool) =>
      pool.label?.toLowerCase().includes(poolSearchQuery.toLowerCase()) ||
      pool.token0Symbol
        ?.toLowerCase()
        .includes(poolSearchQuery.toLowerCase()) ||
      pool.token1Symbol?.toLowerCase().includes(poolSearchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // bg will not black bg will be transparent with some opacity
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Campaign" : "Create New Campaign"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 cursor-pointer text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Pool <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPoolDropdownOpen(!isPoolDropdownOpen)}
                className={`w-full px-4 py-3 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between ${
                  errors.poolAddress ? "border-red-300" : "border-gray-300"
                }`}
                disabled={poolsLoading}
              >
                <span
                  className={
                    getSelectedPool() ? "text-gray-900" : "text-gray-500 p-3"
                  }
                >
                  {poolsLoading
                    ? "Loading pools..."
                    : getSelectedPool()?.label || "Choose a pool"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    isPoolDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isPoolDropdownOpen && !poolsLoading && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search pools..."
                        value={poolSearchQuery}
                        onChange={(e) => setPoolSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="max-h-40 p-3  overflow-y-auto">
                    {filteredPools.map((pool) => (
                      <button
                        key={pool.poolAddress}
                        type="button"
                        onClick={() => {
                          handleInputChange("poolAddress", pool.poolAddress);
                          setIsPoolDropdownOpen(false);
                          setPoolSearchQuery("");
                        }}
                        className={`w-full px-4 py-3 text-left cursor-pointer hover:bg-purple-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                          formData.poolAddress === pool.poolAddress
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-900"
                        }`}
                      >
                        <div className="font-medium">{pool.label}</div>
                        <div className="text-sm text-gray-500">
                          {pool.token0Symbol}/{pool.token1Symbol} •{" "}
                          {pool.poolType}
                        </div>
                      </button>
                    ))}
                    {filteredPools.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm text-center">
                        No pools found matching "{poolSearchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.poolAddress && (
              <p className="text-red-500 text-sm">{errors.poolAddress}</p>
            )}
          </div>

          {errors.seasons && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.seasons}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Season Configuration
            </h3>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600 cursor-pointer" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Bootstrapping Season
                    </h4>
                    <p className="text-sm text-gray-600">
                      Enable early adoption rewards
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "bootstrappingEligible",
                      !formData.bootstrappingEligible
                    )
                  }
                  className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    formData.bootstrappingEligible
                      ? "bg-purple-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.bootstrappingEligible
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {formData.bootstrappingEligible && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.bootstrappingStartDate}
                    onChange={(e) =>
                      handleInputChange(
                        "bootstrappingStartDate",
                        e.target.value
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.bootstrappingStartDate
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.bootstrappingStartDate && (
                    <p className="text-red-500 text-sm">
                      {errors.bootstrappingStartDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600 cursor-pointer" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Early Season</h4>
                    <p className="text-sm text-gray-600">
                      Reward early participants
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "earlySznEligible",
                      !formData.earlySznEligible
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    formData.earlySznEligible ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.earlySznEligible
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {formData.earlySznEligible && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.earlySznStartDate}
                    onChange={(e) =>
                      handleInputChange("earlySznStartDate", e.target.value)
                    }
                    className={`w-full px-3 py-2 cursor-pointer border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.earlySznStartDate
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.earlySznStartDate && (
                    <p className="text-red-500 text-sm">
                      {errors.earlySznStartDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Meme Season</h4>
                    <p className="text-sm text-gray-600">
                      Special meme token rewards
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "memeSznEligible",
                      !formData.memeSznEligible
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    formData.memeSznEligible ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.memeSznEligible
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {formData.memeSznEligible && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.memeSznStartDate}
                    onChange={(e) =>
                      handleInputChange("memeSznStartDate", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.memeSznStartDate
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.memeSznStartDate && (
                    <p className="text-red-500 text-sm">
                      {errors.memeSznStartDate}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 h-12 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 cursor-pointer h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEdit ? "Update Campaign" : "Create Campaign"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
