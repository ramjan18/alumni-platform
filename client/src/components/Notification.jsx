import { useEffect, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { fetcherPost } from "../utils/axiosAPI";

const Notification = ({ id, type, text, stdId, getUserProfileData }) => {
  const handleAcceptClick = async () => {
    const alumId = localStorage.getItem("id");
    const body = {
      alumniId: alumId,
      studentId: stdId,
      referralId: id,
      action: "accept",
    };
    console.log(body);
    await fetcherPost("/job/handleRefferral", { body });
    getUserProfileData(alumId);
    // window.location.reload();
  };

  const handleDeclineClick = async () => {
    const alumId = localStorage.getItem("id");
    const body = {
      alumniId: alumId,
      studentId: stdId,
      referralId: id,
      action: "decline",
    };
    console.log(body);
    await fetcherPost("/job/handleRefferral", { body });
    getUserProfileData(alumId);
    // window.location.reload();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl shadow-lg size-fit px-4 py-3 items-center w-auto md:w-[420px] lg:w-[556px] xl:w-[412px] justify-between">
      <p className="font-poppins text-sm">{text}</p>
      {type === "Referral Request" && (
        <div className="flex gap-3">
          <button
            onClick={handleAcceptClick}
            className="rounded-full p-1 border-4 border-solid border-[#2E8857] text-[#2E8857] font-semibold"
          >
            <FaCheck />
          </button>

          <button
            onClick={handleDeclineClick}
            className="rounded-full p-1 border-4 border-solid border-[#BC0F0F] text-[#BC0F0F]"
          >
            <FaXmark size={34} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
