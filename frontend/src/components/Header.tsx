import logo from "../icons/logoapp.svg";
import plus from "../icons/plus.svg";

const Header = () => {
  return (
    <div className="w-full h-15 md:h-20 bg-white border-b-2 border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex justify-start gap-[10px] md:gap-[15px] items-center ml-[10px] md:ml-10">
          <img
            src={logo}
            alt="App logo"
            className="w-10 h-15 md:w-15 md:h-20"
          />
          <h1 className="font-montserrat font-bold text-[15px] md:text-[25px]">
            CC Route Optimizer
          </h1>
        </div>
        <button className="bg-lime-600 hover:bg-lime-700 px-[10px] py-[5px] md:px-6 md:py-3 rounded mr-[10px] md:mr-10  shadow-md">
          <div className="flex justify-start items-center gap-[5px]">
            <img
              src={plus}
              alt="Plus Icon"
              className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]"
            />
            <h2 className="font-montserrat font-semibold text-white text-[12px] md:text-[20px]">
              New route
            </h2>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
