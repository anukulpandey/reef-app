import { FaArrowUp } from "react-icons/fa";

export default function UserStatsCard({ weeklyStats }) {
  console.log("🚀 ~ UserStatsCard ~ weeklyStats:", weeklyStats);
  // conditional rendering based on weeklyStats prop like display message like connect wallet for getting stats
  // rank
  // :
  // 1
  // referralPoints
  // :
  // 0
  // totalPoints
  // :
  // 7468656928911.87
  // totalUsers
  // :
  // 449
  // userAddress
  // :
  // "5641e34931C03751BFED14C4087bA395303bEd1A5"
  // weeklyChange
  // :
  // 0
  // weeklyPointsEarned
  // :
  // 2987467460964.365 based on this data need to display the data not hardcoded
  if (!weeklyStats) {
    return (
      <div className="bg-[#A93185] text-white p-6 rounded-lg">
        Connect your wallet to see your stats
      </div>
    );
  }
  return (
    <div className="bg-[#A93185] text-white p-6 rounded-lg">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-4">Your Rank</h3>

      {/* Rank Number with superscript "of" text */}
      <div className="relative mb-6">
        <span className="text-[40px] font-normal">{weeklyStats.rank}</span>
        <span className="text-[20px] text-white absolute top-0 ml-4 -translate-y-1">
          of {weeklyStats.totalUsers}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-3 text-[18px]">
        <div className="flex justify-between items-center">
          <span className="text-[#FFFFFF]">Weekly change</span>
          <span className="font-normal flex items-center gap-1">
            <FaArrowUp className="text-xs text-green-300" />
            {weeklyStats.weeklyChange.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-[18px]">
          <span className="text-[#FFFFFF]">Action points</span>
          <span className="font-normal">
            {weeklyStats.actionPoints.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-[18px]">
          <span className="text-[#FFFFFF]">Referral points</span>
          <span className="font-normal">
            {weeklyStats.referralPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
