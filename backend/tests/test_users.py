from unittest.mock import patch

from auth import get_current_user
from fastapi.testclient import TestClient
from main import app

"""
I will define again an user and an admin to use in these tests so we 
don t use Firebase auth
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


def test_get_me_returns_current_user_profile():
    """
    GIVEN: a user that is logged in
    WHEN:  they call GET /users/me
    THEN:  their profile is returned with the correct email and role
    """
    with patch("routers.users.users_collection") as mock_col:
        mock_col.find_one.return_value = {
            "_id": "test_uid_123",
            "firebase_uid": "test_uid_123",
            "email": "test@gmail.com",
            "role": "USER",
        }
        response = client.get("/users/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@gmail.com"
        assert data["role"] == "USER"


def test_get_audit_returns_403_for_user_that_is_not_admin():
    """
    GIVEN: a regular user that is logged in
    WHEN:  they call GET /audit
    THEN:  they should get a 403 forbidden error because only admins can see audit logs
    """
    response = client.get("/audit")
    assert response.status_code == 403


def test_get_audit_returns_all_entries_for_admin():
    """
    GIVEN: an admin that is logged in
    WHEN:  they call GET /audit
    THEN:  all audit log entries are returned
    """
    app.dependency_overrides[get_current_user] = lambda: admin_user

    with patch("routers.users.audit_collection") as mock_col:
        mock_col.find.return_value = [
            {
                "_id": "log1",
                "user_id": "test_uid_123",
                "email": "test@gmail.com",
                "action": "CREATE_ROUTE",
                "route_id": "abc123",
                "ip_address": "127.0.0.1",
                "request_method": "POST",
                "request_path": "/routes",
                "status_code": 200,
            },
            {
                "_id": "log2",
                "user_id": "test_uid_123",
                "email": "test@gmail.com",
                "action": "DELETE_ROUTE",
                "route_id": "abc123",
                "ip_address": "127.0.0.1",
                "request_method": "DELETE",
                "request_path": "/routes/abc123",
                "status_code": 200,
            },
        ]
        response = client.get("/audit")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    app.dependency_overrides[get_current_user] = get_current_test_user


def test_signup_returns_400_if_user_already_exists():
    """
    GIVEN: a user that already has an account
    WHEN:  they try to sign up again with the same firebase_uid
    THEN:  the API should return a 400 bad request error
    """
    with patch("routers.users.users_collection") as mock_col:
        mock_col.find_one.return_value = {
            "_id": "test_uid_123",
            "firebase_uid": "test_uid_123",
            "email": "test@gmail.com",
            "role": "USER",
        }
        response = client.post(
            "/users/signup",
            json={
                "firebase_uid": "test_uid_123",
                "email": "test@gmail.com",
                "name": "Test User",
            },
        )
        assert response.status_code == 400
