CREATE VIEW get_activities AS
    SELECT activity_id, genre, start_time
    FROM Activities
    INNER JOIN Events ON Events.event_id = Activities.event_id
    WHERE $1 = Events.event_id;

-- $1 è l'id dell'evento