from geopy.geocoders import Nominatim
import time


geolocator=Nominatim(user_agent="route_optimizer")

def geocode_address(address: str) -> tuple | None:
    try:
        time.sleep(1.1)
        location= geolocator.geocode(address)
        if location is None:
            return None
        return (location.latitude, location.longitude)
    except Exception as e:
        print(f"Geocoding error for '{address}': {e}")
        return None
    

def geocode_route(route_doc: dict) -> dict:
    starting_position_coordinates= geocode_address(route_doc["starting_position"])
    if starting_position_coordinates:
        route_doc["start_latitude"]= starting_position_coordinates[0]
        route_doc["start_longitude"]= starting_position_coordinates[1]

    for stop in route_doc["stops"]:
        stop_coord= geocode_address(stop["address"])
        if stop_coord:
            stop["latitude"]= stop_coord[0]
            stop["longitude"]= stop_coord[1]
    return route_doc
