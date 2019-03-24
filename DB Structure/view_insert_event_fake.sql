CREATE VIEW insert_event AS
    INSERT INTO Events (event_id, title, capacity, photo, fake_place)
    VALUES (DEFAULT, $1, $2, $3, $4)
    RETURNING event_id;

-- $1 è il titolo dell'evento
-- $2 è la capacità della location
-- $3 è la foto dell'evento
-- $4 è il posto fittizio (es.: "Cortile di casa mia")

    INSERT INTO Activities (activity_id, event_id, genre, start_time)
    VALUES (DEFAULT, event_id, $5, $6),
    RETURNING activity_id;

-- $5/$7 sono i generi di eventi
-- $6/$8 sono gli orari di inizio

    INSERT INTO Guests (activity_id, user_id, guest_role)
    VALUES (activity_id, $9, $10)

-- $9 è l'identificativo dell'utente
-- $10 è il nome del suo ruolo

    INSERT INTO RequiredMaterials (event_id, material, quantity)
    VALUES (event_id, $11, $12);

-- $11 è il nome del materiale da aggiungere
-- $12 è la quantità necessaria