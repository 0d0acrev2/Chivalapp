-- Partecipazione ad un evento.

-- Sono già interessato a quell'evento?

SELECT participation FROM LinkedEvents
WHERE event_id = $1 AND user_id = $2;

-- Se ritorna false vuol dire che ero già interessaato quindi aggiorno la riga

UPDATE LinkedEvents
SET participation = TRUE
WHERE event_id = $1 AND user_id = $2;

-- Altrimenti vuol dire che non ero già interessato quindi inserisco una nuova riga

INSERT INTO LinkedEvents(event_id, user_id, participation)
VALUES ($1, $2, TRUE);
