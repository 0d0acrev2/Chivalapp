-- Conta numero di partecipanti dato un evento
SELECT COUNT(event_id)
FROM LinkedEvents
WHERE event_id = $1;
