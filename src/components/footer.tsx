import { IoMdAttach } from "react-icons/io";
import { IoSend } from "react-icons/io5";

const Footer = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0  h-[80px] pt-2 ">
      <div className="bg-white border-t border-gray-200 p-2 w-[90%] mx-auto rounded-xl mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder={`Reply to ${placeholder}`}
            className="flex-grow bg-transparent outline-none text-gray-700"
          />
          <button className="p-2">
            <IoMdAttach className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2">
            <IoSend className="w-5 h-5 text-green-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
