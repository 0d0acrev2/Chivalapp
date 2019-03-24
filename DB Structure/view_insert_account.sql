CREATE VIEW insert_user AS
    INSERT INTO Users (user_id, user_name, user_surname, user_location, photo, user_description)
    VALUES ($1, $2, $3, $4, $5, $6);

-- $1 è l'user id di firebase
-- $2/$3 sono rispettivamente nome e cognome dell'user
-- $4 è una rappresentazione testuale della location dell'user (gestitevela voi)
-- $5 link alla foto
-- $6 potenziale descrizione dell'user, utile per artisti