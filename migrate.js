const { MongoClient } = require("mongodb");
const { Pool } = require("pg");

async function migrateDB() {
  const mongoClient = await MongoClient.connect("mongodb://localhost:27017/");
  const mongoDB = mongoClient.db("shopnxt");
  const mongoCollection = mongoDB.collection("products");

  const pgPool = new Pool({
    user: "e_comm",
    host: "localhost",
    database: "e_comm",
    password: "1234",
    port: 5432,
  });

  const mongoData = await mongoCollection.find().toArray();
  const pgClient = await pgPool.connect();
  try {
    await pgClient.query("BEGIN");
    const publisherIds = [1, 2, 3, 4, 5];
    for (const doc of mongoData) {
      const now = new Date();

      const publisher_id =
        publisherIds[Math.floor(Math.random() * publisherIds.length)];
      const productInsertResult = await pgClient.query(
        'INSERT INTO "Products" (name, slug, product_image, description, short_description, about, publisher_id, system, processor, memory, storage, graphic_card, price, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
        [
          doc.name,
          doc.slug,
          doc.productImage,
          doc.description,
          doc.shortDescription,
          doc.about,
          publisher_id,
          doc.system,
          doc.processor,
          doc.memory,
          doc.storage,
          doc.graphicCard,
          doc.price,
          doc.active,
        ]
      );
      console.log("AAAAA=>", productInsertResult.rows.length);
      const productId = productInsertResult.rows[0].id;
      await pgClient.query(
        `INSERT INTO "ProductToCategory" ("A", "B") VALUES ($1, $2)`,
        [productId, categoryId]
      );

      const developerId = Math.floor(Math.random() * 5) + 1; // IDs de 1 a 5
      await pgClient.query(`INSERT INTO "ProductToDeveloper" VALUES ($1, $2)`, [
        productId,
        developerId,
      ]);
    }
    await pgClient.query("COMMIT");
    console.log("done");
  } catch (error) {
    await pgClient.query("ROLLBACK");
    console.log(error);
    throw error;
  } finally {
    pgClient.release();
  }
  await mongoClient.close();
  await pgPool.end();
}

migrateDB()
  .then(() => {
    console.log("Dados migrados");
  })
  .catch((error) => console.error("Deu ruim", error));
