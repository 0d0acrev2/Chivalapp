CREATE VIEW get_guests AS
    SELECT user_id, guest_role
    FROM Guests
    INNER JOIN Activities ON Guests.activity_id = Activities.activity_id
    WHERE $1 = Activities.activity_id;

-- $1 è l'id dell'activity