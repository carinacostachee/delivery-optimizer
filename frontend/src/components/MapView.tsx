import type { Route } from "../types";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { stopIcon, warehouseIcon } from "../utils/mapIcons";
import magic from "../icons/magic.svg";

interface Props {
  route: Route | null;
  onOptimize: () => void;
}

const MapView = ({ route, onOptimize }: Props) => {
  return (
    <div className="relative flex-1 min-h-[250px]">
      <MapContainer
        center={[52.3676, 4.9041]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap © CartoDB"
        />
        {route?.start_latitude && route?.start_longitude && (
          <Marker
            position={[route.start_latitude, route.start_longitude]}
            icon={warehouseIcon}
          >
            <Popup>{route.starting_position}</Popup>
          </Marker>
        )}
        {route?.stops?.map((stop) =>
          stop.latitude && stop.longitude ? (
            <Marker
              key={stop.address}
              position={[stop.latitude, stop.longitude]}
              icon={stopIcon}
            >
              <Popup>{stop.address}</Popup>
            </Marker>
          ) : null,
        )}
        {route?.status === "OPTIMIZED" && (
          <Polyline
            positions={[
              [route.start_latitude!, route.start_longitude!] as [
                number,
                number,
              ],
              ...route
                .stops!.sort((x, z) => x.order_number - z.order_number)
                .map(
                  (stop) =>
                    [stop.latitude!, stop.longitude!] as [number, number],
                ),
            ]}
            color="#16a34a"
            weight={3}
            opacity={0.8}
          />
        )}
      </MapContainer>
      {route?.status === "PENDING" && (
        <button
          onClick={onOptimize}
          className="absolute bottom-[70px] right-[70px] z-[1000] bg-lime-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-lime-700 font-montserrat "
        >
          <div className="flex flex-row items-center justify-center gap-[10px]">
            <img src={magic} alt="Optimize button" />
            <h1 className="font-montserrat text-[12px]">Optimize Route</h1>
          </div>
        </button>
      )}
    </div>
  );
};

export default MapView;
