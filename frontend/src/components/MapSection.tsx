import type { Route } from "../types";
import MapView from "./MapView";
import StatsBar from "./StatsBar";

interface Props {
  route: Route | null;
  onOptimize: () => void;
}
const MapSection = ({ route, onOptimize }: Props) => {
  return (
    <div className="flex flex-col justify-start w-full pt-8 ml-0 gap-[20px] ">
      <StatsBar route={route} />
      <MapView route={route} onOptimize={onOptimize} />
    </div>
  );
};

export default MapSection;
