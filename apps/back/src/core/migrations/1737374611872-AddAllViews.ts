import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAllViews1737374611872 implements MigrationInterface {
  name = 'AddAllViews1737374611872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "public"."typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'product_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "product_view"`);
    await queryRunner.query(`CREATE VIEW "product_view" AS 
    SELECT DISTINCT ON (data->>'id') 
        data->>'id' AS id,
        data->>'description' AS description,
        data->>'product_type' AS product_type,
        data->>'seller_id' AS seller_id,
        data->>'buyer_id' AS buyer_id,
        data->>'auction_id' AS auction_id,
        (data->>'start_price')::numeric AS start_price,
        data->>'status' AS status,
        data->>'updated_at' AS updated_at
    FROM events
    WHERE aggregation_type = 'product'
    ORDER BY data->>'id', data->>'updated_at' DESC;
  `);
    await queryRunner.query(
      `INSERT INTO "public"."typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'product_view',
        "SELECT DISTINCT ON (data->>'id') \n        data->>'id' AS id,\n        data->>'description' AS description,\n        data->>'product_type' AS product_type,\n        data->>'seller_id' AS seller_id,\n        data->>'buyer_id' AS buyer_id,\n        data->>'auction_id' AS auction_id,\n        (data->>'start_price')::numeric AS start_price,\n        data->>'status' AS status,\n        data->>'updated_at' AS updated_at\n    FROM events\n    WHERE aggregation_type = 'product'\n    ORDER BY data->>'id', data->>'updated_at' DESC;",
      ],
    );
    await queryRunner.query(`CREATE VIEW "bid_view" AS 
    SELECT DISTINCT ON (data->>'id') 
        data->>'id' AS id,
        data->>'bidder_id' AS bidder_id,
        data->>'auction_id' AS auction_id,
        (data->>'amount')::numeric AS amount,
        data->>'bid_time' AS bid_time
    FROM events
    WHERE aggregation_type = 'bid'
    ORDER BY data->>'id', data->>'bid_time' DESC;
  `);
    await queryRunner.query(
      `INSERT INTO "public"."typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'bid_view',
        "SELECT DISTINCT ON (data->>'id') \n        data->>'id' AS id,\n        data->>'bidder_id' AS bidder_id,\n        data->>'auction_id' AS auction_id,\n        (data->>'amount')::numeric AS amount,\n        data->>'bid_time' AS bid_time\n    FROM events\n    WHERE aggregation_type = 'bid'\n    ORDER BY data->>'id', data->>'bid_time' DESC;",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "public"."typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'bid_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "bid_view"`);
    await queryRunner.query(
      `DELETE FROM "public"."typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'product_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "product_view"`);
    await queryRunner.query(`CREATE VIEW "product_view" AS SELECT 
        data->>'id' AS id,
        data->>'description' AS description,
        data->>'product_type' AS product_type,
        data->>'seller_id' AS seller_id,
        data->>'buyer_id' AS buyer_id,
        data->>'auction_id' AS auction_id,
        (data->>'start_price')::numeric AS start_price,
        data->>'status' AS status
    FROM events
    WHERE aggregation_type = 'product'`);
    await queryRunner.query(
      `INSERT INTO "public"."typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'product_view',
        "SELECT \n        data->>'id' AS id,\n        data->>'description' AS description,\n        data->>'product_type' AS product_type,\n        data->>'seller_id' AS seller_id,\n        data->>'buyer_id' AS buyer_id,\n        data->>'auction_id' AS auction_id,\n        (data->>'start_price')::numeric AS start_price,\n        data->>'status' AS status\n    FROM events\n    WHERE aggregation_type = 'product'",
      ],
    );
  }
}
