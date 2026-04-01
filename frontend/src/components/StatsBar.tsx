import stopLogo from "../icons/package.svg";
import esttime from "../icons/estimatedtime.svg";
import lane from "../icons/lane.svg";
import type { Route } from "../types";

interface Props {
  route: Route | null;
}

const StatsBar = ({ route }: Props) => {
  return (
    <div className="flex flex-row justify-between items-stretch w-full gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
      <div className="flex flex-row justify-start items-center gap-2 md:gap-3 lg:gap-[50px] box-border flex-1 border-2 border-gray-200 p-2 md:p-3 lg:p-4 rounded-xl bg-white overflow-hidden">
        <img
          src={lane}
          alt="Lane logo"
          className="w-4 h-4 md:w-6 md:h-6 lg:w-10 lg:h-10 flex-shrink-0"
        />
        <div className="flex flex-col gap-1 lg:gap-[10px] min-w-0">
          <p className="font-montserrat text-gray-400 text-[7px] md:text-[11px] lg:text-[20px] leading-tight">
            Total Distance
          </p>
          <p className="font-montserrat font-bold text-[9px] md:text-[14px] lg:text-[25px] leading-tight">
            {route?.total_distance ? `${route.total_distance} km` : "—"}
          </p>
          <p className="hidden lg:block font-montserrat text-gray-300 text-[16px]">
            Haversine estimate
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-start items-center gap-2 md:gap-3 lg:gap-[50px] box-border flex-1 border-2 border-gray-200 p-2 md:p-3 lg:p-4 rounded-xl bg-white overflow-hidden">
        <img
          src={esttime}
          alt="Time logo"
          className="w-4 h-4 md:w-6 md:h-6 lg:w-10 lg:h-10 flex-shrink-0"
        />
        <div className="flex flex-col gap-1 lg:gap-[10px] min-w-0">
          <p className="font-montserrat text-gray-400 text-[7px] md:text-[11px] lg:text-[20px] leading-tight">
            Estimated Duration
          </p>
          <p className="font-montserrat font-bold text-[9px] md:text-[14px] lg:text-[25px] leading-tight">
            {route?.estimated_time ? `${route.estimated_time} min` : "0"}
          </p>
          <p className="hidden lg:block font-montserrat text-gray-300 text-[16px]">
            At 30km/h avg
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-start items-center gap-2 md:gap-3 lg:gap-[50px] box-border flex-1 border-2 border-gray-200 p-2 md:p-3 lg:p-4 rounded-xl bg-white overflow-hidden">
        <img
          src={stopLogo}
          alt="Stop logo"
          className="w-4 h-4 md:w-6 md:h-6 lg:w-10 lg:h-10 flex-shrink-0"
        />
        <div className="flex flex-col gap-1 lg:gap-[10px] min-w-0">
          <p className="font-montserrat text-gray-400 text-[7px] md:text-[11px] lg:text-[20px] leading-tight">
            Stops
          </p>
          <p className="font-montserrat font-bold text-[9px] md:text-[14px] lg:text-[25px] leading-tight">
            {route?.stops?.length !== 1
              ? `${route?.stops?.length} stops`
              : `${route?.stops?.length} stop`}
          </p>
          <p className="hidden lg:block font-montserrat text-gray-300 text-[16px]">
            Delivery addresses
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
