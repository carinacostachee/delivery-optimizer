import warehouse from "../icons/warehouse.svg";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import pin from "../icons/pin.svg";
import L from "leaflet";

export const warehouseIcon = L.icon({
  iconUrl: warehouse,
  shadowUrl,
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

export const stopIcon = L.icon({
  iconUrl: pin,
  shadowUrl,
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});
