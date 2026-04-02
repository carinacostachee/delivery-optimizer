import mongomock
import pytest
from datetime import datetime


@pytest.fixture
def db():
    """
    Sets up a fake in-memory MongoDB database for each test.
    No real database connection is needed.
    """
    client = mongomock.MongoClient()
    return client["test_db"]


def test_insert_user_and_find_by_firebase_uid(db):
    """
    GIVEN: an empty users collection
    WHEN:  a user document is inserted with a firebase_uid
    THEN:  the user can be retrieved by querying on firebase_uid
    """
    users_collection = db["users"]
    user_doc = {
        "firebase_uid": "test_uid_123",
        "email": "test@gmail.com",
        "name": "Test User",
        "role": "USER",
        "created_at": datetime.now(),
    }
    users_collection.insert_one(user_doc)

    result = users_collection.find_one({"firebase_uid": "test_uid_123"})
    assert result is not None
    assert result["email"] == "test@gmail.com"
    assert result["role"] == "USER"


def test_duplicate_firebase_uid_returns_two_documents(db):
    """
    GIVEN: a users collection that already has a user with a given firebase_uid
    WHEN:  a second user with the same firebase_uid is inserted
    THEN:  find() returns two documents (MongoDB itself does not enforce uniqueness
           unless an index is created — this test documents that behavior)
    """
    users_collection = db["users"]
    user_doc = {"firebase_uid": "same_uid", "email": "first@gmail.com", "role": "USER"}
    users_collection.insert_one(user_doc)
    users_collection.insert_one(
        {"firebase_uid": "same_uid", "email": "second@gmail.com", "role": "USER"}
    )

    results = list(users_collection.find({"firebase_uid": "same_uid"}))
    assert len(results) == 2


def test_insert_route_and_find_by_created_by(db):
    """
    GIVEN: an empty routes collection
    WHEN:  a route document is inserted with a created_by field
    THEN:  the route can be retrieved by querying on created_by
    """
    routes_collection = db["routes"]
    route_doc = {
        "name": "My Route",
        "starting_position": "Amsterdam",
        "start_latitude": 52.37,
        "start_longitude": 4.89,
        "stops": [],
        "status": "PENDING",
        "created_by": "test_uid_123",
        "created_at": datetime.now(),
    }
    routes_collection.insert_one(route_doc)

    result = routes_collection.find_one({"created_by": "test_uid_123"})
    assert result is not None
    assert result["name"] == "My Route"
    assert result["status"] == "PENDING"


def test_delete_route_removes_it_from_collection(db):
    """
    GIVEN: a routes collection with one route
    WHEN:  that route is deleted using delete_one
    THEN:  the collection should be empty and find_one should return None
    """
    routes_collection = db["routes"]
    route_doc = {
        "name": "Route to delete",
        "starting_position": "Rotterdam",
        "stops": [],
        "status": "PENDING",
        "created_by": "test_uid_123",
    }
    result = routes_collection.insert_one(route_doc)
    inserted_id = result.inserted_id

    routes_collection.delete_one({"_id": inserted_id})

    deleted = routes_collection.find_one({"_id": inserted_id})
    assert deleted is None


def test_update_route_status_to_optimized(db):
    """
    GIVEN: a route in the collection with status PENDING
    WHEN:  update_one is called to set the status to OPTIMIZED
    THEN:  the route document in the collection should reflect the new status
    """
    routes_collection = db["routes"]
    route_doc = {
        "name": "Route to optimize",
        "starting_position": "Amsterdam",
        "stops": [],
        "status": "PENDING",
        "created_by": "test_uid_123",
    }
    result = routes_collection.insert_one(route_doc)
    inserted_id = result.inserted_id

    routes_collection.update_one(
        {"_id": inserted_id},
        {"$set": {"status": "OPTIMIZED", "total_distance": 500.0, "estimated_time": 360}},
    )

    updated = routes_collection.find_one({"_id": inserted_id})
    assert updated["status"] == "OPTIMIZED"
    assert updated["total_distance"] == 500.0
    assert updated["estimated_time"] == 360


def test_insert_audit_log_entry(db):
    """
    GIVEN: an empty audit collection
    WHEN:  an audit log entry is inserted after a user creates a route
    THEN:  the entry can be found and contains the correct action and user email
    """
    audit_collection = db["audit"]
    audit_doc = {
        "user_id": "test_uid_123",
        "email": "test@gmail.com",
        "action": "CREATE_ROUTE",
        "route_id": "abc123",
        "ip_address": "127.0.0.1",
        "created_at": datetime.now(),
        "request_method": "POST",
        "request_path": "/routes",
        "status_code": 200,
    }
    audit_collection.insert_one(audit_doc)

    result = audit_collection.find_one({"action": "CREATE_ROUTE"})
    assert result is not None
    assert result["email"] == "test@gmail.com"
    assert result["status_code"] == 200


def test_find_all_routes_returns_only_matching_user(db):
    """
    GIVEN: a routes collection with routes belonging to two different users
    WHEN:  routes are queried by a specific created_by value
    THEN:  only the routes belonging to that user are returned
    """
    routes_collection = db["routes"]
    routes_collection.insert_many([
        {"name": "Route A", "created_by": "user_1", "status": "PENDING"},
        {"name": "Route B", "created_by": "user_1", "status": "PENDING"},
        {"name": "Route C", "created_by": "user_2", "status": "PENDING"},
    ])

    user_1_routes = list(routes_collection.find({"created_by": "user_1"}))
    assert len(user_1_routes) == 2
    assert all(r["created_by"] == "user_1" for r in user_1_routes)
