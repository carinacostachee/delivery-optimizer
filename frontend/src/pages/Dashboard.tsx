import MapSection from "../components/MapSection";
import SideBar from "../components/SideBar";
import DrawerSide from "../components/DrawerSide";
import { useEffect, useState } from "react";
import type { Route } from "../types";
import { getRoute, postOptimizeRoute } from "../api/routes";
import Header from "../components/Header";
import NewRouteModal from "../components/NewRouteModal";

const Dashboard = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function toggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    if (!selectedId) return;
    getRoute(selectedId).then(setSelectedRoute);
  }, [selectedId]);

  const handleOptimize = async () => {
    if (!selectedId) return;
    await postOptimizeRoute(selectedId);
    getRoute(selectedId).then(setSelectedRoute);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col h-full">
      <Header onOpenModal={toggleModal} />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-[320px] shrink-0 bg-white border-r-2 border-gray-200">
          <SideBar
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={() => setRefreshKey((k) => k + 1)}
            key={refreshKey}
          />
        </div>

        <main className="flex-1 bg-slate-50 flex items-start justify-start relative p-6">
          <button
            className="md:hidden absolute top-4 left-4 z-20 p-2 bg-white rounded-lg shadow border border-gray-200"
            onClick={() => setDrawerOpen(true)}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <MapSection route={selectedRoute} onOptimize={handleOptimize} />
        </main>

        <DrawerSide
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setDrawerOpen(false);
          }}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onDelete={() => setRefreshKey((k) => k + 1)}
        />
        <NewRouteModal
          isOpen={showModal}
          onClose={toggleModal}
          onCreated={() => {
            setRefreshKey((k) => k + 1);
            toggleModal();
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
