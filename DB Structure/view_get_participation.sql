CREATE VIEW get_partecipation AS
    SELECT participation
    FROM LinkedEvents
    INNER JOIN Events ON Events.event_id = LinkedEvents.event_id
    INNER JOIN Users ON Users.user_id = LinkedEvents.user_id
    WHERE $1 = LinkedEvents.user_id AND $2 = LinkedEvents.event_id;

-- $1 è l'user id
-- $2 è l'id dell'evento