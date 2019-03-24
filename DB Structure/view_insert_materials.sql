CREATE VIEW insert_materials AS
    INSERT INTO RequiredMaterials (event_id, material, quantity)
    VALUES ($1, $2, $3);

-- $1 è l'id dell'evento
-- $2 è la stringa col nome del materiale
-- $3 è la quantità necessaria