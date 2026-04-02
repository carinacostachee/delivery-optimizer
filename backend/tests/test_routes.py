from unittest.mock import patch

from auth import get_current_user
from fastapi.testclient import TestClient
from main import app

"""
I am going to define a user that we are going to use 
in this file so we don't have to use Firebase auth
"""

test_user = {
    "_id": "test_uid_123",
    "firebase_uid": "test_uid_123",
    "email": "test@gmail.com",
    "role": "USER",
}

admin_user = {
    "_id": "admin_uid",
    "firebase_uid": "admin_uid",
    "email": "admin@gmail.com",
    "role": "ADMIN",
}


def get_current_test_user():
    return test_user


app.dependency_overrides[get_current_user] = get_current_test_user

client = TestClient(app)


def test_get_all_routes_returns_only_user_routes():
    """
    GIVEN: a user that is logged in
    WHEN:  they call GET /routes
    THEN:  only the routes they have created are shown.
    """
    with patch("routers.routes.routes_collection") as mock_col:
        mock_col.find.return_value = [
            {
                "_id": "abc123",
                "name": "My Route",
                "created_by": "test_uid_123",
                "starting_position": "Amsterdam",
                "stops": [],
                "status": "PENDING",
            }
        ]
        response = client.get("/routes")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "My Route"


def test_admin_gets_all_routes():
    """
    GIVEN: an admin that is logged in
    WHEN:  they call GET /routes
    THEN:  all routes from all users are returned.
    """
    app.dependency_overrides[get_current_user] = lambda: admin_user

    with patch("routers.routes.routes_collection") as mock_col:
        mock_col.find.return_value = [
            {
                "_id": "abc123",
                "name": "Route 1",
                "created_by": "user1_uid",
                "starting_position": "Amsterdam",
                "stops": [],
                "status": "PENDING",
            },
            {
                "_id": "def456",
                "name": "Route 2",
                "created_by": "user2_uid",
                "starting_position": "Rotterdam",
                "stops": [],
                "status": "PENDING",
            },
        ]
        response = client.get("/routes")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    app.dependency_overrides[get_current_user] = get_current_test_user


def test_get_route_returns_404_if_route_does_not_exist():
    """
    GIVEN: a user that is logged in
    WHEN:  they call GET /routes/{id} with an id that doesn't exist in the database
    THEN:  the API should return a 404 not found error
    """
    with patch("routers.routes.routes_collection") as mock_col:
        mock_col.find_one.return_value = None
        response = client.get("/routes/000000000000000000000000")
        assert response.status_code == 404


def test_get_route_returns_403_if_route_belongs_to_another_user():
    """
    GIVEN: a user that is logged in
    WHEN:  they call GET /routes/{id} for a route that was created by someone else
    THEN:  the API should return a 403 forbidden error
    """
    with patch("routers.routes.routes_collection") as mock_col:
        mock_col.find_one.return_value = {
            "_id": "abc123",
            "name": "Not my route",
            "created_by": "another_uid",
            "starting_position": "Rotterdam",
            "stops": [],
            "status": "PENDING",
        }
        response = client.get("/routes/000000000000000000000000")
        assert response.status_code == 403


def test_delete_route_returns_403_if_route_belongs_to_another_user():
    """
    GIVEN: a user that is logged in
    WHEN:  they try to DELETE a route that was created by someone else
    THEN:  the API should return a 403 forbidden error
    """
    with patch("routers.routes.routes_collection") as mock_col:
        mock_col.find_one.return_value = {
            "_id": "abc123",
            "name": "Not my route",
            "created_by": "another_uid",
            "starting_position": "Rotterdam",
            "stops": [],
            "status": "PENDING",
        }
        response = client.delete("/routes/000000000000000000000000")
        assert response.status_code == 403


def test_delete_route_returns_404_if_route_does_not_exist():
    """
    GIVEN: a user that is logged in
    WHEN:  they try to DELETE a route with an id that doesn't exist
    THEN:  the API should return a 404 not found error
    """
    with patch("routers.routes.routes_collection") as mock_col:
        mock_col.find_one.return_value = None
        response = client.delete("/routes/000000000000000000000000")
        assert response.status_code == 404


def test_create_route_writes_audit_log():
    """
    GIVEN: a user that is logged in
    WHEN:  they create a new route
    THEN:  an audit log entry with action CREATE_ROUTE should be written to the database
    """
    with patch("routers.routes.routes_collection") as mock_routes, patch(
        "routers.routes.audit_collection"
    ) as mock_audit, patch("routers.routes.geocode_route") as mock_geocode:

        mock_geocode.return_value = {
            "name": "Test Route",
            "starting_position": "Amsterdam",
            "start_latitude": 52.37,
            "start_longitude": 4.89,
            "stops": [],
            "status": "PENDING",
            "created_at": None,
            "created_by": "test_uid_123",
        }
        mock_routes.insert_one.return_value.inserted_id = "abc123"
        mock_routes.find_one.return_value = {
            "_id": "abc123",
            "name": "Test Route",
            "starting_position": "Amsterdam",
            "start_latitude": 52.37,
            "start_longitude": 4.89,
            "stops": [],
            "status": "PENDING",
            "created_by": "test_uid_123",
        }

        client.post(
            "/routes",
            json={
                "name": "Test Route",
                "starting_position": "Amsterdam",
                "stops": [],
            },
        )

        mock_audit.insert_one.assert_called_once()
        call_args = mock_audit.insert_one.call_args[0][0]
        assert call_args["action"] == "CREATE_ROUTE"
        assert call_args["email"] == "test@gmail.com"
