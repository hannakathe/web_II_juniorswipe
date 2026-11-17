def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.get_json()["status"] == "ok"


def test_root_describes_service(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.get_json()["service"] == "juniorswipe-api"
