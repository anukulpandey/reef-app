import { FaGamepad, FaRocket } from "react-icons/fa";
import TokenImage from "../../assets/seas-reaf-token.png";
import joyImage from "../../assets/seas-joy-wallet.png";
import seasonReef from "../../assets/season-reef.png";

export default function SeasonBanner() {
  return (
    <div className="bg-[#2C024D] text-white px-4 py-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 h-full">
        {/* Left Side */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 md:pl-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-2xl font-bold">Season 1</h1>
            <p className="text-purple-200 text-[16px] max-w-xs">
              Earn points by providing liquidity, swapping, and referring
            </p>
          </div>

          <div className="flex gap-6 items-center justify-center">
            <img
              src={TokenImage}
              className="w-[80px] md:w-[98px] h-auto"
              alt="Token"
            />
            <img
              src={joyImage}
              alt="Joy Wallet"
              className="w-[100px] md:w-[115px] h-auto rotate-[15deg] translate-y-1"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center">
          <img
            src={seasonReef}
            alt="Season Reef"
            className="w-[160px] md:w-[185px] h-auto"
          />
        </div>
      </div>
    </div>
  );
}
