UPDATE RequiredMaterials
SET quantity = quantity - 1
WHERE $1 = event_id AND $2 = material;

-- $1 è l'id dell'evento
-- $2 è il nome del materiale