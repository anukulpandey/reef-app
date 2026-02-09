import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

export default function ReferralCodeCard({ referralInfo }) {
  console.log("🚀 ~ ReferralCodeCard ~ referralInfo:", referralInfo);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralInfo?.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  // Return early if no referral info
  if (!referralInfo) {
    return (
      <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
        <p>No referral info available.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#A93185] text-white p-6 rounded-lg">
      <h3 className="text-[20px] font-semibold mb-4">Your Referral Code</h3>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-[30px] font-normal">
            {referralInfo.referralCode || ""}
          </span>
          <button
            onClick={handleCopyCode}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Copy referral code"
          >
            {copied ? (
              <FaCheck className="text-sm text-green-300" />
            ) : (
              <FaCopy className="text-sm cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[#FFFFFF] font-normal text-[18px]">
            Total value of referees
          </span>
          <span className="text-[18px] font-normal">
            ${referralInfo.totalValueOfReferees || "0.00"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#FFFFFF] font-normal text-[18px]">
            Referral points
          </span>
          <span className="text-[18px] font-medium">
            {referralInfo.referralPoints || "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
}
