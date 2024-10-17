import { Database } from 'jsr:@db/sqlite@0.11';
import { toKebabCase } from 'https://deno.land/std@0.217.0/text/case.ts';

const db = new Database('bird.db');
db.exec(`
  DROP TABLE IF EXISTS bird;
  CREATE TABLE IF NOT EXISTS bird (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    permalink TEXT,
    UNIQUE(id, permalink)
  );
`);
db.exec('insert into bird (name, permalink) values(:name, :permalink)', {
  name: 'big bird',
  permalink: 'big-birb',
});
db.exec('insert into bird (name, permalink) values(:name, :permalink)', {
  name: 'pigeon',
  permalink: 'pigeon',
});

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const id = path.split('/')[2];

  if (!path.startsWith('/birds')) {
    return new Response('Not Found', { status: 404 });
  }

  if (req.method === 'GET' && id) {
    const bird = db.prepare('SELECT * FROM bird WHERE permalink = :id')
      .get({ id: id });

    if (bird) {
      return new Response(JSON.stringify(bird), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      return new Response(
        JSON.stringify({
          message: 'Bird not found',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  if (req.method === 'GET') {
    const birds = db.prepare('SELECT * FROM bird')
      .values();
    return new Response(JSON.stringify(birds), {
      headers: { 'Content-Type': 'application/json' },
      status: birds.length ? 200 : 404,
    });
  }

  if (req.method === 'POST') {
    try {
      const { name } = await req.json();
      const permalink = toKebabCase(name);
      const bird = db.prepare(
        'INSERT INTO bird (name, permalink) VALUES (:name, :permalink)',
      )
        .get([name, permalink]);

      return new Response(JSON.stringify(bird), {
        status: 201,
        headers: { 'Content-type': 'application/json' },
      });
    } catch (err) {
      console.log(err);
      return new Response(
        JSON.stringify({
          message: 'Invalid request body',
        }),
      );
    }
  }

  return new Response('Method not allowed', { status: 405 });
});
