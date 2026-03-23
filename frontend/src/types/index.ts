export interface Stop {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  order_number: number;
}

export type RouteStatus = "PENDING" | "OPTIMIZED";

export interface Route {
  id: string;
  name: string;
  starting_position: string;
  start_latitude: number;
  start_longitude: number;
  stops?: Stop[];
  status: RouteStatus;
  total_distance: number | null;
  estimated_time: number | null;
  created_at: string;
}

export interface AddRoute {
  name: string;
  starting_position: string;
  stops: { name: string; address: string }[];
}
