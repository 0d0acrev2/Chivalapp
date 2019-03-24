CREATE VIEW get_agenda_futuri AS
    SELECT Events.event_id, title, capacity, photo, fake_place, maps_place, description, start_time::TIMESTAMP::DATE AS start
    FROM Events
    INNER JOIN Activities ON Events.event_id = Activities.event_id
    WHERE Activities.start_time > CURRENT_TIMESTAMP
    GROUP BY Events.event_id, start;