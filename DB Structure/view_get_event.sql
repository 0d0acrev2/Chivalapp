CREATE VIEW get_event AS
    SELECT title, start_time, photo, capacity, fake_place, maps_place
    FROM Events
    INNER JOIN Activities ON Events.event_id = Activities.event_id
    WHERE $1 = Events.event_id;

-- $1 è l'id dell'evento