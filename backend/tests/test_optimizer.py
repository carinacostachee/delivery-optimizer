from services.optimizer import (
    build_distance_matrix,
    haversine,
    nearest_neighbour,
    optimize_route,
)


def test_haversine_known_distance():
    """
    GIVEN: 2 coordinates with a known distance : Paris and London (341km)
    WHEN: haversine function is called
    THEN: it should return a value closed to the expected distance.
    """

    paris = (48.8566, 2.3522)
    london = (51.5074, -0.1278)
    result = haversine(paris, london)
    assert 330 < result < 360


def test_haversine_same_location():
    """
    GIVEN: 1 coordinate given 2 times
    WHEN: haversine function is called
    THEN: it should return 0.
    """
    paris = (48.8566, 2.3522)
    result = haversine(paris, paris)
    assert result == 0.0


def test_build_distance_matrix_shape():
    """
    GIVEN: a list with 3 coordinates
    WHEN: build_distance_matrix function is called
    THEN: it should return a 3x3 matrix.
    """
    coords = [(48.8566, 2.3522), (51.5074, -0.1278), (52.3676, 4.9041)]
    matrix = build_distance_matrix(coords)
    assert len(matrix) == 3
    assert all(len(row) == 3 for row in matrix)


def test_build_distance_matrix_diagonal_is_zero():
    """
    GIVEN: a list with 3 (or more) coordinates
    WHEN: build_distance_matrix function is called
    THEN: the distance from a point to itself (the diagonal points) should always be 0
    """
    coords = [(48.8566, 2.3522), (51.5074, -0.1278), (52.3676, 4.9041)]
    matrix = build_distance_matrix(coords)
    assert all(matrix[i][i] == 0.0 for i in range(len(coords)))


def test_nearest_neighbour_visits_all_stops():
    """
    GIVEN: a list with 3 (or more) coordinates
    WHEN: nearest_neighbour function is called
    THEN: all stops indices should appear only one time in the result
    """

    coords = [(48.8566, 2.3522), (51.5074, -0.1278), (52.3676, 4.9041)]
    matrix = build_distance_matrix(coords)
    route = nearest_neighbour(matrix)
    assert sorted(route) == [0, 1, 2]


def test_nearest_neighbour_starts_at_warehouse():
    """
    GIVEN: a distance matrix
    WHEN:  nearest_neighbour function is called
    THEN:  the first stop in the result should always be index 0 (the starting point)
    """
    coords = [(48.8566, 2.3522), (51.5074, -0.1278), (52.3676, 4.9041)]
    matrix = build_distance_matrix(coords)
    route = nearest_neighbour(matrix)
    assert route[0] == 0


def test_optimize_route_sets_status_and_distance():
    """
    GIVEN: a route doc with geocoded stops
    WHEN:  optimize_route function is called
    THEN:  the status should be OPTIMIZED, total_distance should be set and
    the estimated time should be more than 0 min
    """
    route_doc = {
        "starting_position": "Warehouse",
        "start_latitude": 48.8566,
        "start_longitude": 2.3522,
        "stops": [
            {
                "name": "Stop A",
                "address": "Paris",
                "latitude": 51.5074,
                "longitude": -0.1278,
                "order_number": 0,
            },
            {
                "name": "Stop B",
                "address": "Amsterdam",
                "latitude": 52.3676,
                "longitude": 4.9041,
                "order_number": 0,
            },
        ],
    }
    result = optimize_route(route_doc)
    assert result["status"] == "OPTIMIZED"
    assert result["total_distance"] > 0
    assert result["estimated_time"] > 0


def test_optimize_route_assigns_order_numbers():
    """
    GIVEN:  a route doc with multiple stops
    WHEN:   optimize_route function  is called
    THEN:   each stop should have a unique order_number starting from 1
    """
    route_doc = {
        "starting_position": "Warehouse",
        "start_latitude": 48.8566,
        "start_longitude": 2.3522,
        "stops": [
            {
                "name": "Stop A",
                "address": "Paris",
                "latitude": 51.5074,
                "longitude": -0.1278,
                "order_number": 0,
            },
            {
                "name": "Stop B",
                "address": "Amsterdam",
                "latitude": 52.3676,
                "longitude": 4.9041,
                "order_number": 0,
            },
        ],
    }
    result = optimize_route(route_doc)
    order_numbers = [s["order_number"] for s in result["stops"]]
    assert sorted(order_numbers) == [1, 2]


def test_optimize_route_skips_if_missing_coordinates():
    """
    GIVEN: a route doc where a stop has no coordinates
    WHEN:  optimize_route function is called
    THEN:  the route should be returned unchanged,
    so there should be no crash.
    """
    route_doc = {
        "starting_position": "Warehouse",
        "start_latitude": 48.8566,
        "start_longitude": 2.3522,
        "stops": [
            {
                "name": "Stop A",
                "address": "Unknown",
                "latitude": None,
                "longitude": None,
                "order_number": 0,
            },
        ],
    }
    result = optimize_route(route_doc)
    assert result["stops"][0]["order_number"] == 0
