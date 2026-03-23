import { useEffect, useState } from "react";
import { fetchAllRoutes } from "../api/routes";
import type { Route } from "../types";
import RouteCard from "./RouteCard";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const SideBar = ({ selectedId, onSelect, onDelete }: Props) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRoutes()
      .then(setRoutes)
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex w-full h-[20px] md:h-[60px] border-b-2 border-gray-200 justify-start items-center">
        <div className="ml-10 font-montserrat text-gray-500 text-semibold">
          SAVED ROUTES
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <>
            <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          </>
        ) : (
          routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isSelected={selectedId === route.id}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SideBar;
