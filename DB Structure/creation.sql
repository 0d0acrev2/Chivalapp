CREATE TABLE Users(
    user_id             varchar PRIMARY KEY,
    user_name           varchar NOT NULL,
    user_surname        varchar NOT NULL,
    user_location       varchar NOT NULL,
    photo               varchar,
    user_description    varchar
);

CREATE TABLE Events(
    event_id    serial  PRIMARY KEY,
    title       varchar NOT NULL,
    capacity    integer NOT NULL,
    photo       varchar,
    fake_place  varchar,
    maps_place  varchar,
    description varchar
);

CREATE TABLE LinkedEvents(
    event_id        integer NOT NULL REFERENCES Events,
    user_id         varchar NOT NULL REFERENCES Users,
    participation   boolean NOT NULL
);

CREATE TABLE Activities(
    activity_id serial      PRIMARY KEY,
    event_id    integer     NOT NULL REFERENCES Events,
    genre       varchar     NOT NULL,
    start_time  timestamp
);

CREATE TABLE Guests(
    activity_id integer NOT NULL REFERENCES Activities,
    user_id     varchar NOT NULL REFERENCES Users,
    guest_role  varchar NOT NULL
);

CREATE TABLE RequiredMaterials(
    event_id    integer NOT NULL REFERENCES Events,
    material    varchar NOT NULL,
    quantity    integer NOT NULL
);

CREATE TABLE RequiredPersons(
    event_id    integer NOT NULL REFERENCES Events,
    person_role varchar NOT NULL,
    quantity    integer NOT NULL
);
