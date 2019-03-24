CREATE VIEW getPlace AS
    SELECT * FROM Events
    WHERE Events.maps_place = $1;

-- ritorna tutti gli eventi nel luogo $1
