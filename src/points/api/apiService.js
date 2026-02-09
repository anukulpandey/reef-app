// api/apiService.js (Updated version)
import axios from "./axiosInstance.js";
import Cookies from "js-cookie";

const apiService = {
  // admin routes
  Signin: async (payload) => {
    console.log("🚀 ~ Signin: ~ payload:", payload);
    try {
      const response = await axios.post("/admin/admin-login", payload);
      console.log("🚀 ~ Signin: ~ response:", response);
      const staticExpiryDate = new Date();
      staticExpiryDate.setDate(staticExpiryDate.getDate() + 7); // 7 days from now

      // Support both {data: {access_token, ...}} and {access_token, ...} response shapes
      const data = response.data.data || response.data;
      const { access_token, refreshToken } = data;
      if (access_token) {
        Cookies.set("access_token", access_token, {
          expires: staticExpiryDate,
        });
      }
      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
      }
      return data;
    } catch (error) {
      console.log("🚀 ~ Signin: ~ error:", error.response?.data || error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await axios.get("/admin/profile");
      return response.data;
    } catch (error) {
      console.log(
        "🚀 ~ getCurrentUser: ~ error:",
        error.response?.data || error
      );
      throw error.response?.data || { message: "Failed to get user data" };
    }
  },

  // Get all pools for dropdown
  getPools: async () => {
    try {
      const response = await axios.get("/campaigns/pools/dropdown");
      return response.data;
    } catch (error) {
      console.log("🚀 ~ getPools: ~ error:", error.response?.data || error);
      throw error.response?.data || { message: "Failed to fetch pools" };
    }
  },

  // Get all campaigns
  // Get all campaigns with pagination
  getCampaigns: async (page = 1, limit = 20) => {
    try {
      const response = await axios.get(
        `/campaigns/pools?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.log("🚀 ~ getCampaigns: ~ error:", error.response?.data || error);
      throw error.response?.data || { message: "Failed to fetch campaigns" };
    }
  },

  // Create new campaign
  createCampaign: async (campaignData) => {
    console.log("🚀 ~ campaignData:", campaignData);
    try {
      const response = await axios.post(
        "/campaigns/pools/bulk-eligibility",
        campaignData
      );
      return response.data;
    } catch (error) {
      console.log(
        "🚀 ~ createCampaign: ~ error:",
        error.response?.data || error
      );
      throw error.response?.data || { message: "Failed to create campaign" };
    }
  },

  // Update campaign
  updateCampaign: async (poolAddress, campaignData) => {
    try {
      // /campaigns/pools/0x0000000000000000000000000000000001000000_0x15820d37b1cC11f102076070897ACde06511B2fa/eligibility
      // pool address
      const response = await axios.patch(
        `/campaigns/pools/${poolAddress}/eligibility`,
        campaignData
      );
      return response.data;
    } catch (error) {
      console.log(
        "🚀 ~ updateCampaign: ~ error:",
        error.response?.data || error
      );
      throw error.response?.data || { message: "Failed to update campaign" };
    }
  },

  // Refresh token
  refreshToken: async (payload) => {
    try {
      const response = await axios.post("/auth/refresh", payload);
      return response.data;
    } catch (error) {
      console.log("🚀 ~ refreshToken: ~ error:", error.response?.data || error);
      throw error.response?.data || { message: "Failed to refresh token" };
    }
  },

  // Logout
  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
  },

  deleteCampaign: async (id) => {
    try {
      const response = await axios.delete(`/admin/campaign/${id}`);
      console.log("🚀 ~ deleteCampaign: ~ response:", response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete campaign" };
    }
  },

  // user routes

  connectWallet: async (address) => {
    try {
      const response = await axios.post("/users/connect-wallet", { address });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to connect wallet",
        }
      );
    }
  },

  // Get daily leaderboard points

  getLeaderboardPoints: async () => {
    try {
      const response = await axios.get("points/daily-total-points");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch leaderboard points",
        }
      );
    }
  },
  // Leaderboard for user (with EVM address)
  getUserLeaderboardPoints: async (address) => {
    try {
      const response = await axios.get(
        `/points/leaderboard?userAddress=${address}`
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch user leaderboard points",
        }
      );
    }
  },

  // Weekly stats for a user
  getUserWeeklyStats: async (address) => {
    try {
      const response = await axios.get(
        `/points/user-stats?userAddress=${address}`
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch weekly stats",
        }
      );
    }
  },
  // Referral info for a user
  getReferralInfo: async (address) => {
    try {
      const response = await axios.get(
        `/referrals/user-referral-info/${address}`
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch referral info",
        }
      );
    }
  },
};
export default apiService;
