const functions = require('firebase-functions');
const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');

const connectionName = 'hacklocal:europe-west3:hacklocal-postgresql-instance';
const dbUser = 'hacklocal';
const dbPassword = 'giwRM8LW7vGu6Bq';
const dbName = 'hacklocal';

const pgConfig = {
  max: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  //host: `/cloudsql/${connectionName}`,
  host: '35.246.234.155',
};

// Connection pools reuse connections between invocations,
// and handle dropped or expired connections automatically.
let pgPool;

app.use(cors());

app.get('/getHomePageEventList', async (req, res) => {
  const query = `SELECT Events.event_id, title, photo, fake_place, maps_place, description, start_time::TIMESTAMP::DATE AS start
    FROM Events
    INNER JOIN Activities ON Events.event_id = Activities.event_id
    WHERE Activities.start_time > CURRENT_TIMESTAMP
    GROUP BY Events.event_id, start;`;

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  let client;
  try {
    client = await pgPool.connect();
    const results = await client.query(query);

    const object = {
      events : results.rows,
    }
    
    object.filterName = req.query.tag;
    if(object.filterName === "Prossimamente"){
      object.events.reverse();  
    }
    res.json(object);
  } catch (ex) {
    console.error(ex);
    res.json({ex});
  } finally {
    if (client) {
      client.release();
    }
  }

});
  

app.get('/subscribeToEvent', async (req, res) => {
    const { eventID = null } = req.query; 
    const { userID = null } = req.query;

    /// INSERT Nella Tabella LinkedEvents
    const query = `INSERT INTO LinkedEvents(event_id, user_id, participation) VALUES ($1, $2, TRUE);`;

    const values = [eventID, userID];

    if (!pgPool) {
      pgPool = new pg.Pool(pgConfig);
    }

    let client;
    try {
      client = await pgPool.connect();
      const results = await client.query(query, values);
      res.json("OK");
    } catch (ex) {
      console.error(ex);
      res.json({ex});
    } finally {
      if (client) {
        client.release();
      }
    }
  
});

/* Routes di visualizzazione */
app.get('/getEvent', async (req, res) => {
  const { eventID = null } = req.query;
  const { userID = null } = req.query;

  const query = `
      SELECT title, start_time, photo, description, capacity, fake_place, maps_place
      FROM Events
      INNER JOIN Activities ON Events.event_id = Activities.event_id
      WHERE $1 = Events.event_id
    `;
  const values = [eventID];

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  let client;
  try {
    client = await pgPool.connect();
    const results = await client.query(query, values);
    const obj = results.rows[0];

    const materialsNeededQuery = `
      SELECT material, quantity
      FROM RequiredMaterials
      INNER JOIN Events ON RequiredMaterials.event_id = Events.event_id
      WHERE $1 = Events.event_id
    `;

    const materials = await client.query(materialsNeededQuery, values);

    const activitesQuery = `
      SELECT Activities.activity_id, genre, start_time, Users.photo
      FROM Activities
      INNER JOIN Events ON Events.event_id = Activities.event_id
      INNER JOIN Guests ON Guests.activity_id = Activities.activity_id
      INNER JOIN Users ON Users.user_id = Guests.user_id
      WHERE $1 = Events.event_id
    `;

    
    const activities = await client.query(activitesQuery, values);

    const quantiPartecipanoQuery = `SELECT COUNT(event_id) AS totalePartecipanti FROM LinkedEvents WHERE event_id = $1;`
    const count = (await client.query(quantiPartecipanoQuery, values)).rows[0].totalepartecipanti;

    obj.count = count;

    const partecipationQuery = `SELECT participation
      FROM LinkedEvents
      INNER JOIN Events ON Events.event_id = LinkedEvents.event_id
      INNER JOIN Users ON Users.user_id = LinkedEvents.user_id
      WHERE $2 = LinkedEvents.user_id AND $1 = LinkedEvents.event_id;`;

    values.push(userID);

    const partecipo = await client.query(partecipationQuery, values);
    
    obj.activities = activities.rows;
    obj.materials = materials.rows;
    
    obj.partecipo = partecipo.rows.length !== 0;

    res.json(obj);
  } catch (ex) {
    console.error(ex);
    res.json({ex});
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.post('/createEvent', async (req, res) => {
  console.log(req.body);

  const {title, materials, description, fake_place, activities, capacity} = req.body;
  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }


  let client;
  try {
    client = await pgPool.connect();

    const values = [title, capacity, fake_place, 'https://picsum.photos/200/300/?random', description];
    const insertEventQuery = `INSERT INTO Events (event_id, title, capacity, fake_place, photo, description) VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING event_id;`;
    const results = await client.query(insertEventQuery, values);
    
    console.log(results.rows[0].event_id);
    const event_id = results.rows[0].event_id;

    for(const activity of activities){
      let start_time = "2019-04-14T22:00:00.000Z";
      const insertActivitiesQuery = `INSERT INTO Activities (activity_id, event_id, genre, start_time) VALUES (DEFAULT, $1, $2, $3) RETURNING activity_id;`;
      const values = [event_id, activity.genre, start_time];
      
      const activity_id = (await client.query(insertActivitiesQuery, values)).rows[0].activity_id;

      const insertGuestsQuery = `INSERT INTO Guests (activity_id, user_id, guest_role) VALUES ($1, $2, $3)`;
      const valori = [activity_id, "WNBGDkAa4edyq6M8fUvMKQZvOao2", "Poeta"];

      await client.query(insertGuestsQuery, valori);
    }
    for(const current of materials) {
      const insertMaterialQuery = `INSERT INTO RequiredMaterials (event_id, material, quantity) VALUES ($1, $2, $3);`;
      const values = [event_id, current.nome, current.quantity]

      await client.query(insertMaterialQuery, values);
    }

    res.sendStatus(200);
    
  } catch (ex) {
    console.error(ex);
    res.json({ex});
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.get('/getPlace', (req, res) => {
  const placeID = req.params.placeID;


  /// Effettua query
  const eventOBJ1 = {
    nome: "Acrobazie tra le Poesie",
    orario: new Date(),
    img: "/img/banner-disco.png",
    numeroPartecipanti: 0,
    tags: ["oltretorrente"]
  }
  const eventOBJ2 = {
    nome: "Tante sedie per le scuole medie",
    orario: new Date(),
    img: "",
    numeroPartecipanti: 0,
    tags: ["oltretorrente"]
  }
  const data = {
    nome: "Cortile Dorato",
    img: "/img/banner-disco.png",
    descrizione: "Questo posto rappresenta l'evacuazione dei sistemi celesti in ogni posizione considerata.",
    //posizione: Maps
    eventiFuturi: [
      eventOBJ1,
      eventOBJ2,
    ]
  }

  res.json(data);
});

app.post('/syncNewUser', (req, res) => {
  const {uid, nome, cognome, location} = req.body;
  const query = `INSERT INTO users (user_id, user_name, user_surname, user_location) VALUES ('${uid}', '${nome}', '${cognome}', '${location}')`;

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  pgPool.query(query, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('User synced correctly!');
    }
  });
});

app.get('/propongoPortoIo', async (req,res) => {
  console.log(req.query);
  const { eventID, materiale } = req.query;
  const event_id = eventID;

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  let client;
  try {
    client = await pgPool.connect();
    const insertMaterialQuery = `INSERT INTO RequiredMaterials (event_id, material, quantity) VALUES ($1, $2, $3);`;
    const values = [event_id, materiale, 0];

  await client.query(insertMaterialQuery, values);
    
    res.sendStatus(200);

  } catch (ex) {
    console.error(ex);
    res.json({ex});
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.get('/loPortoIo', async (req, res) => {
  const { eventID, materiale, userID } = req.query;

  const query = `UPDATE RequiredMaterials SET quantity = quantity - 1 WHERE $1 = event_id AND $2 = material;`;
  const values = [eventID, materiale];

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  let client;
  try {
    client = await pgPool.connect();
    const results = await client.query(query, values);
    
    res.sendStatus(200);

  } catch (ex) {
    console.error(ex);
    res.json({ex});
  } finally {
    if (client) {
      client.release();
    }
  }
});

exports.app = functions.region('europe-west1').https.onRequest(app);

/*
exports.createUserRecord = functions.region('europe-west1').auth.user().onCreate((user) => {
  const {uid} = user;
  const query = `INSERT INTO users (user_id) VALUES ('${uid}')`;

  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  pgPool.query(query, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('User synced correctly!');
    }
  });
});
*/