import stopLogo from "../icons/package.svg";
import esttime from "../icons/estimatedtime.svg";
import lane from "../icons/lane.svg";
import type { Route } from "../types";

interface Props {
  route: Route | null;
}
const MapSection = ({ route }: Props) => {
  return (
    <div className="flex flex-col justify-start w-full pt-8 ml-0  ">
      <div className="flex flex-row justify-between items-start w-full gap-[10px] md:gap-4">
        <div className="flex flex-row justify-start items-center gap-[10px] md:gap-[50px] box-border flex-1 h-[100px] md:h-[150px] border-2  border-gray-200 p-4 rounded-xl bg-white overflow-hidden">
          <img
            src={lane}
            alt="Lane logo"
            className="w-5 h-5 ml-2 md:w-10 md:h-10 md:ml-5"
          />
          <div className="flex flex-col gap-[10px]">
            <h1 className="font-montserrat text-semibold text-gray-400 text-[8px] md:text-[20px]">
              Total Distance
            </h1>
            <h1 className="font-montserrat text-bold text-[10px] md:text-[25px]">
              {route?.total_distance ? `${route.total_distance} km` : "—"}
            </h1>
            <h4 className="font-montserrat text-semibold text-gray-300 text-[6px] md:text-[20px]">
              Haversine estimate
            </h4>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-[10px] md:gap-[50px] box-border flex-1 h-[100px] md:h-[150px] border-2  border-gray-200 p-4 rounded-xl bg-white overflow-hidden">
          <img
            src={esttime}
            alt="Time logo"
            className="w-5 h-5 ml-1 md:w-10 md:h-10 md:ml-5"
          />
          <div className="flex flex-col gap-[10px]">
            <h1 className="font-montserrat text-semibold text-gray-400 text-[8px] md:text-[20px]">
              Estimated Duration
            </h1>
            <h1 className="font-montserrat text-bold text-[12px] md:text-[25px]">
              {route?.estimated_time ? `${route.estimated_time} min` : "0"}
            </h1>
            <h4 className="font-montserrat text-semibold text-gray-300 text-[6px] md:text-[20px] ">
              At 30km/h avg
            </h4>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-[10px] md:gap-[50px] box-border flex-1 h-[100px] md:h-[150px] border-2  border-gray-200 p-4 rounded-xl bg-white overflow-hidden ">
          <img
            src={stopLogo}
            alt="Stop logo"
            className="w-5 h-5 ml-2 md:w-10 md:h-10 md:ml-5"
          />
          <div className="flex flex-col gap-[10px]">
            <h1 className="font-montserrat text-semibold text-gray-400 text-[8px] md:text-[20px]">
              Stops
            </h1>
            <h1 className="font-montserrat text-bold text-[10px] md:text-[25px] ">
              {route?.stops?.length !== 1
                ? `${route?.stops?.length} stops`
                : `${route?.stops?.length} stop`}
            </h1>
            <h4 className="font-montserrat text-semibold text-gray-300 text-[6px] md:text-[20px]">
              Delivery addresses
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
