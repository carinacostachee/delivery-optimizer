import logo from "../icons/logoapp.svg";
import plus from "../icons/plus.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
interface Props {
  onOpenModal: () => void;
}
const Header = ({ onOpenModal }: Props) => {
  const {user, logout}= useAuth();
  const navigate=useNavigate();

  const handleLogout=async () => {
    await logout();
    navigate("/login");
  };
  
  return (
    <div className="w-full bg-white border-b-2 border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 md:px-5 lg:px-10 py-2 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <img
            src={logo}
            alt="App logo"
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0"
          />
          <h1 className="font-montserrat font-bold text-[15px] md:text-[18px] lg:text-[25px] whitespace-nowrap">
            CC Route Optimizer
          </h1>
        </div>
        <div className="flex items-center gap-2 lg:gap-4 min-w-0">
          <span className="font-montserrat text-[11px] md:text-[12px] lg:text-[16px] text-gray-500 truncate min-w-0">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="font-montserrat text-[11px] md:text-[12px] lg:text-[16px] text-red-500 hover:text-red-700 whitespace-nowrap flex-shrink-0"
          >
            Logout
          </button>
          <button
            className="bg-lime-600 hover:bg-lime-700 px-2 py-1 md:px-3 md:py-1.5 lg:px-6 lg:py-3 rounded shadow-md flex-shrink-0"
            onClick={onOpenModal}
          >
            <div className="flex items-center gap-1">
              <img
                src={plus}
                alt="Plus Icon"
                className="w-4 h-4 md:w-5 md:h-5 lg:w-[30px] lg:h-[30px]"
              />
              <span className="font-montserrat font-semibold text-white text-[11px] md:text-[13px] lg:text-[20px] whitespace-nowrap">
                New route
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
