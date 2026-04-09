const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
);

exports.handler = async (event) => {
  const { title, citations } = JSON.parse(event.body);

  const session = driver.session();

  try {
    for (const c of citations) {
      await session.run(
        `
        MERGE (p1:Paper {title: $title})
        MERGE (p2:Paper {title: $cited})
        MERGE (p1)-[:CITES]->(p2)
        `,
        { title: title, cited: c.title }
      );
    }

    return { statusCode: 200, body: "OK" };
  } catch (e) {
    return { statusCode: 500, body: e.toString() };
  } finally {
    await session.close();
  }
};