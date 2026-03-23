import type { Route } from "../types";
import stopLogo from "../icons/package.svg";
import esttime from "../icons/estimatedtime.svg";
import lane from "../icons/lane.svg";
import deleteButton from "../icons/delete.svg";
import { useState } from "react";
import { deleteRoute } from "../api/routes";
interface Props {
  route: Route;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const RouteCard = ({ route, isSelected, onSelect, onDelete }: Props) => {
  const handleDeleteRoute = async () => {
    await deleteRoute(route.id);
    onDelete(route.id);
  };
  return (
    <div
      onClick={() => onSelect(route.id)}
      className={`p-3 rounded-xl cursor-pointer border transition-all ${
        isSelected
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-slate-800 text-sm">{route.name}</p>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            route.status === "OPTIMIZED"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {route.status}
        </span>
        <img
          src={deleteButton}
          alt="Delete button"
          className="w-[15px] h-[15px]"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRoute();
          }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1">{route.starting_position}</p>
      <div className="flex flex-row justify-start items-center gap-[12px] ml-3 mt-3">
        <div className="flex flex-row items-center gap-[5px]">
          <img src={stopLogo} alt="stop logo" className="w-5 h-5" />
          <h2 className="font-montserrat text-semibold text-slate-400 text-[10px] md:text-[15px]">
            {route.stops?.length} {route.stops?.length === 1 ? "stop" : "stops"}
          </h2>
        </div>
        <div className="flex flex-row items-center gap-[5px]">
          <img src={esttime} alt="time logo" className="w-5 h-5" />
          <h2 className="font-montserrat text-semibold text-slate-400 text-[10px] md:text-[15px]">
            {route.status === "PENDING"
              ? "0 min"
              : `${route.estimated_time} min`}
          </h2>
        </div>
        <div className="flex flex-row items-center gap-[5px]">
          <img src={lane} alt="distance logo" className="w-5 h-5" />
          <h2 className="font-montserrat text-semibold text-slate-400 text-[10px] md:text-[15px]">
            {route.status === "PENDING" ? "0 km" : `${route.total_distance} km`}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
