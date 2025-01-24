import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuctionView1737376043797 implements MigrationInterface {
  name = 'AddAuctionView1737376043797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "auction_view" AS 
    SELECT DISTINCT ON (data->>'id') 
        data->>'id' AS id,
        data->>'seller_id' AS seller_id,
        data->>'product_id' AS product_id,
        data->>'start_time' AS start_time,
        data->>'end_time' AS end_time,
        (data->>'starting_price')::numeric AS starting_price,
        (data->>'ending_price')::numeric AS ending_price,
        data->>'status' AS status,
        data->>'updated_at' AS updated_at
    FROM events
    WHERE aggregation_type = 'auction'
    ORDER BY data->>'id', data->>'updated_at' DESC;
  `);
    await queryRunner.query(
      `INSERT INTO "public"."typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'auction_view',
        "SELECT DISTINCT ON (data->>'id') \n        data->>'id' AS id,\n        data->>'seller_id' AS seller_id,\n        data->>'product_id' AS product_id,\n        data->>'start_time' AS start_time,\n        data->>'end_time' AS end_time,\n        (data->>'starting_price')::numeric AS starting_price,\n        (data->>'ending_price')::numeric AS ending_price,\n        data->>'status' AS status,\n        data->>'updated_at' AS updated_at\n    FROM events\n    WHERE aggregation_type = 'auction'\n    ORDER BY data->>'id', data->>'updated_at' DESC;",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "public"."typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'auction_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "auction_view"`);
  }
}
