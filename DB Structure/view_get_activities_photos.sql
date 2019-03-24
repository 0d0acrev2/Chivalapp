CREATE VIEW get_activities AS
    SELECT Activities.activity_id, genre, start_time, Users.photo
    FROM Activities
    INNER JOIN Events ON Events.event_id = Activities.event_id
    INNER JOIN Guests ON Guests.activity_id = Activities.activity_id
    INNER JOIN Users ON Users.user_id = Guests.user_id
    WHERE $1 = Events.event_id;

-- $1 è l'id dell'evento