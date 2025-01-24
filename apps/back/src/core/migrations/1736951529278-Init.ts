import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1736951529278 implements MigrationInterface {
  name = 'Init1736951529278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."events_event_type_enum" AS ENUM('User was created', 'User was updated', 'User was deleted', 'Product was created', 'Product was rejected', 'Product was verified', 'A bid was placed', 'An auction was started', 'An auction was ended')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."events_aggregation_type_enum" AS ENUM('product', 'auction', 'user', 'bid')`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_type" "public"."events_event_type_enum" NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "aggregator_id" uuid NOT NULL, "aggregation_type" "public"."events_aggregation_type_enum" NOT NULL, "data" jsonb NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(
      `DROP TYPE "public"."events_aggregation_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."events_event_type_enum"`);
  }
}
