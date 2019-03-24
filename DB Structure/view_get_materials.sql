CREATE VIEW get_materials AS
    SELECT material, quantity
    FROM RequiredMaterials
    INNER JOIN Events ON RequiredMaterials.event_id = Events.event_id
    WHERE $1 = Events.event_id;

-- $1 è l'id dell'evento