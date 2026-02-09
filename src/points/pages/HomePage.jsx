import Header from "../components/Layout/Header";
import SeasonBanner from "../components/Home/SeasonBanner";
import LeaderboardTable from "../components/Home/LeaderboardTable";
import { useEffect, useState } from "react";
import apiService from "../api/apiService";
import UserStatsCard from "../components/Home/UserStatsCard";
import ReferralCodeCard from "../components/Home/ReferralCodeCard";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx"; // You'll need to create this
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [referralInfo, setReferralInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLeaderboardData, setUserLeaderboardData] = useState(null);
  const [hasUserPoints, setHasUserPoints] = useState(false);

  const { selectedAccount } = useAuth();
  console.log("🚀 ~ Home ~ selectedAccount:", selectedAccount);

  const fetchDataWithAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const evmAddress =
        selectedAccount?.evmAddress || selectedAccount?.address;
      console.log("🚀 ~ fetchDataWithAccount ~ evmAddress:", evmAddress);

      // Call all three APIs concurrently when account is connected
      const [leaderboardResponse, referralResponse, userStatsResponse] =
        await Promise.all([
          apiService.getUserLeaderboardPoints(evmAddress),
          apiService.getReferralInfo(evmAddress),
          apiService.getUserWeeklyStats(evmAddress),
        ]);

      // Store the full leaderboard response
      setUserLeaderboardData(leaderboardResponse);

      // Check if user has points by checking currentUserRank and aroundUser
      const userHasPoints =
        leaderboardResponse.currentUserRank !== null &&
        leaderboardResponse.aroundUser &&
        leaderboardResponse.aroundUser.length > 0;

      setHasUserPoints(userHasPoints);

      if (userHasPoints) {
        // Create combined leaderboard: top5 + separator + aroundUser
        const top5 = leaderboardResponse.top5 || [];
        const aroundUser = leaderboardResponse.aroundUser || [];
        const currentUserAddress =
          selectedAccount?.evmAddress || selectedAccount?.address;

        // Normalize data format for user-specific API
        const normalizeUserData = (data) =>
          data.map((item) => ({
            ...item,
            totalActionPoints: item.actionPoints,
            totalReferralPoints: item.referralPoints,
          }));

        // Find the index of the current user in aroundUser array
        const userIndex = aroundUser.findIndex(
          (item) =>
            item.rank === "You" ||
            item.userAddress?.toLowerCase() ===
              currentUserAddress?.toLowerCase()
        );

        // Get 2 records above and 2 records below the current user
        let filteredAroundUser = [];
        if (userIndex !== -1) {
          const start = Math.max(0, userIndex - 2);
          const end = Math.min(aroundUser.length, userIndex + 3); // +3 to include current user + 2 below
          filteredAroundUser = aroundUser.slice(start, end);
        } else {
          // If user not found, just show the aroundUser as is
          filteredAroundUser = aroundUser;
        }

        const combinedLeaderboard = [
          ...normalizeUserData(top5),
          // Add a separator if we have both top5 and aroundUser
          ...(top5.length > 0 && filteredAroundUser.length > 0
            ? [{ isSeparator: true }]
            : []),
          ...normalizeUserData(filteredAroundUser),
        ];

        setLeaderboard(combinedLeaderboard);
      } else {
        // If user has no points, we'll show the message instead
        setLeaderboard([]);
      }

      setReferralInfo(referralResponse);
      setWeeklyStats(userStatsResponse);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataWithoutAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      // Only call generic leaderboard when no account is connected
      const leaderboardResponse = await apiService.getLeaderboardPoints();

      // Handle general API response structure
      const leaderboardData = Array.isArray(leaderboardResponse)
        ? leaderboardResponse
        : leaderboardResponse.data || [];

      setLeaderboard(leaderboardData);

      // Reset user-specific data when no account
      setReferralInfo(null);
      setWeeklyStats(null);
      setUserLeaderboardData(null);
      setHasUserPoints(false);
    } catch (err) {
      console.error("Error fetching generic leaderboard:", err);
      setError(err.message || "Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user has selected an account (either with EVM address or native address)
    if (
      selectedAccount &&
      (selectedAccount.evmAddress || selectedAccount.address)
    ) {
      fetchDataWithAccount();
    } else {
      fetchDataWithoutAccount();
    }
  }, [selectedAccount]);

  // Show loading skeleton while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="main max-w-7xl mx-auto p-4 sm:p-4 lg:p-16">
          <h1 className="text-2xl font-bold text-gray-900 my-8">
            ReefSwap Points
          </h1>
          <SeasonBanner />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="main max-w-7xl mx-auto p-4 sm:p-4 lg:p-16">
          <h1 className="text-2xl font-bold text-gray-900 my-8">
            ReefSwap Points
          </h1>
          <SeasonBanner />
          <div className="py-12 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={
                selectedAccount &&
                (selectedAccount.evmAddress || selectedAccount.address)
                  ? fetchDataWithAccount
                  : fetchDataWithoutAccount
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="main max-w-7xl mx-auto p-4 sm:p-4 lg:p-16">
        <h1 className="text-2xl font-bold text-gray-900 my-8">
          ReefSwap Points
        </h1>

        <SeasonBanner />

        {/* Show centered message when user is connected but has no points */}
        {selectedAccount &&
          (selectedAccount.evmAddress || selectedAccount.address) &&
          !hasUserPoints && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Start Earning Points!
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Provide some liquidity or start swapping to access your
                  leaderboard points and check your rank.
                </p>
              </div>
            </div>
          )}

        {/* Show components when user has points or no account connected */}
        {(!(
          selectedAccount &&
          (selectedAccount.evmAddress || selectedAccount.address)
        ) ||
          hasUserPoints) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LeaderboardTable data={leaderboard} />
            </div>

            {/* Only show user stats and referral cards when account is connected and has points */}
            {selectedAccount &&
              (selectedAccount.evmAddress || selectedAccount.address) &&
              hasUserPoints && (
                <div className="space-y-12 mt-16">
                  <UserStatsCard weeklyStats={weeklyStats} />
                  <ReferralCodeCard referralInfo={referralInfo} />
                </div>
              )}

            {/* Show message when no account is connected */}
            {!(
              selectedAccount &&
              (selectedAccount.evmAddress || selectedAccount.address)
            ) && (
              <div className="space-y-12 mt-16">
                <div className="bg-gray-50 shadow-md p-6 rounded-lg text-center">
                  <p className="text-gray-600">
                    Connect your account to view your stats and referral
                    information.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
