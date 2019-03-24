Users
- user_id (PK)
- user_name : `string`
- user_surname : `string`
- user_location : `string`
- photo : `string`
- user_description: `string`

Events
- event_id (PK)
- title : `string`
- capacity : `int`
- photo : `string`
- fake_place : `string`
- maps_place : `string`

LinkedEvents
- event_id (EK → Event)
- user_id (EK → User)
- participation : `boolean`

Activities
- activity_id (PK)
- event_id (EK → Event)
- genre : `string/combobox`
- start_time : `timestamp`

Guests
- activity_id (EK → Activity)
- user_id (EK → User)
- guest_role : `string/combobox`

RequiredMaterials
- event_id (EK → Event)
- material: `string`
- quantity : `int`

RequiredPersons
- event_id (EK → Event)
- person_role : `string/combobox`
- quantity : `int`
