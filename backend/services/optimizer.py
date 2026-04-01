import math


# this function just gives the distance between 2 coordinates
def haversine(coord1: tuple, coord2: tuple) -> float:
    R = 6371
    lat1, long1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, long2 = math.radians(coord2[0]), math.radians(coord2[1])
    dlat = lat2 - lat1
    dlong = long2 - long1
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlong / 2) ** 2
    )
    return R * 2 * math.asin(math.sqrt(a))


def build_distance_matrix(coord: list) -> list:
    n = len(coord)
    # the initial distance matrix has only 0s
    distance_matrix = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                # then we compute all the distances and update the matrix
                distance_matrix[i][j] = haversine(coord[i], coord[j])
    return distance_matrix


def nearest_neighbour(matrix: list, start: int = 0) -> list:
    n = len(matrix)
    visited = [False] * n
    route = [0]
    visited[0] = True

    for i in range(n - 1):
        current_stop = route[-1]
        nearest = None
        nearest_dist = float("inf")
        for j in range(n):
            if not visited[j]:
                if matrix[current_stop][j] < nearest_dist:
                    nearest = j
                    nearest_dist = matrix[current_stop][j]
        route.append(nearest)
        visited[nearest] = True

    return route


def optimize_route(route_doc: dict) -> dict:
    if not all(
        stop["latitude"] is not None and stop["longitude"] is not None
        for stop in route_doc["stops"]
    ):
        return route_doc

    coordinates_list = [(route_doc["start_latitude"], route_doc["start_longitude"])]
    for stop in route_doc["stops"]:
        coordinates_list.append((stop["latitude"], stop["longitude"]))

    distance_matrix = build_distance_matrix(coordinates_list)
    order = nearest_neighbour(distance_matrix, 0)

    for rank, coords_index in enumerate(order[1:], start=1):
        stop_index = coords_index - 1
        route_doc["stops"][stop_index]["order_number"] = rank

    total_distance = sum(
        haversine(coordinates_list[order[i]], coordinates_list[order[i + 1]])
        for i in range(len(order) - 1)
    )
    route_doc["total_distance"] = round(total_distance, 2)
    route_doc["estimated_time"] = int((total_distance / 30) * 60)
    route_doc["status"] = "OPTIMIZED"
    return route_doc
