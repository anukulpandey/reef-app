import { useState } from "react";

export default function LeaderboardTable({ data = [] }) {
  console.log("🚀 ~ LeaderboardTable ~ data:", data);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-xl  p-2">
        <table className="w-full">
          <thead className=" bg-transparent">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#000000]">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#000000]">
                User
              </th>
              <th className="px-4 py-3 text-left  text-sm font-semibold text-[#000000]">
                Action Points
              </th>
              <th className="px-4 py-3 text-left  text-sm font-semibold text-[#000000]">
                Referral Points
              </th>
              <th className="px-4 py-3 text-left  text-sm font-semibold text-[#000000]">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-[#F8F9FF] ">
            {paginated.map((row, index) => {
              // Handle separator row
              if (row.isSeparator) {
                return (
                  <tr key={`separator-${index}`} className="bg-white">
                    <td
                      colSpan="5"
                      className="px-4 py-2 text-center text-sm text-gray-500 bg-white"
                    >
                      <div className="flex justify-center">
                        <span className="px-3 text-xs">...</span>
                      </div>
                    </td>
                  </tr>
                );
              }

              // Determine if this is the current user rowmeans
              const isCurrentUser = row.rank === "You";
              const rowBgClass = isCurrentUser
                ? "bg-blue-50 border-2 border-blue-200"
                : "";

              return (
                <tr key={index} className={rowBgClass}>
                  <td className="px-4 py-3 text-sm text-[##000000] font-semibold">
                    {row.rank === "You" ? (
                      <span className=" text-gray-900 py-1 rounded text-xs font-bold">
                        You
                      </span>
                    ) : (
                      row.rank
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.userAddress && row.userAddress.length > 10
                      ? `${row.userAddress.slice(
                          0,
                          6
                        )}...${row.userAddress.slice(-4)}`
                      : row.userAddress}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900  ">
                    {Number(
                      row.totalActionPoints || row.actionPoints || 0
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {Number(
                      row.totalReferralPoints || row.referralPoints || 0
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900  font-medium">
                    {Number(row.total).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination Controls - now inside the card/table div */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 shadow-lg rounded-lg bg-[#f8f9ff] py-3">
            <button
              className="px-3 py-1 sm:w-[8rem] w-[6rem] cursor-pointer rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50 shadow"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded sm:w-[8rem] w-[6rem] cursor-pointer bg-gray-200 text-gray-700 font-medium disabled:opacity-50 shadow"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
