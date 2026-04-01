import type { Route } from "../types";
import MapView from "./MapView";
import StatsBar from "./StatsBar";

interface Props {
  route: Route | null;
  onOptimize: () => void;
}
const MapSection = ({ route, onOptimize }: Props) => {
  return (
    <div className="flex flex-col w-full flex-1 min-h-0 gap-3 pt-10 md:pt-0 md:gap-4">
      <StatsBar route={route} />
      <MapView route={route} onOptimize={onOptimize} />
    </div>
  );
};

export default MapSection;
