import { useEffect, useState } from "react";
import { fetchAllRoutes } from "../api/routes";
import type { Route } from "../types";
import RouteCard from "./RouteCard";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DrawerSide = ({ selectedId, onSelect, isOpen, onClose }: Props) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRoutes()
      .then(setRoutes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-[320px] bg-white border-r-2 border-gray-200 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full h-[60px] border-b-2 border-gray-200 justify-between items-center px-4">
          <div className="font-montserrat text-gray-500 text-semibold">
            SAVED ROUTES
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
            <span className="sr-only">Close menu</span>
          </button>
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
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DrawerSide;
