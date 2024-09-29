import { IoArrowBackSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import Profile from "../assets/Profile.svg";

interface CHeaderProps {
  tripName: string;
  from: string;
  to: string;
}

const CHeader: React.FC<CHeaderProps> = ({ tripName, from, to }) => {
  return (
    <header className="fixed top-0 h-[120px] border-b-2 border-gray-500 w-screen flex flex-col px-2 py-4 text-xl gap-2 bg-[#E5E5E0]">
      <div className="flex flex-row justify-between">
        <span className="flex items-center gap-4">
          <IoArrowBackSharp />
          <span className="font-bold">{tripName}</span>
        </span>
        <span className="p-1">
          <FiEdit />
        </span>
      </div>
      <div className="flex px-2 items-center">
        <span className="w-full pr-2 flex flex-row gap-4">
          <img src={Profile} alt="profile" />
          <span className="flex flex-col ">
            <p>
              <span className="text-base text-gray-600">From</span> {from}
            </p>
            <p>
              <span className="text-base text-gray-600">To</span> {to}
            </p>
          </span>
        </span>
        <span>
          <HiDotsVertical />
        </span>
      </div>
    </header>
  );
};

export default CHeader;
