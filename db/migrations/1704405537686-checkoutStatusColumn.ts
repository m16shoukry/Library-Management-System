import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckoutStatusColumn1704405537686 implements MigrationInterface {
    name = 'CheckoutStatusColumn1704405537686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."checkouts_status_enum" AS ENUM('sold', 'borrowed', 'returned')`);
        await queryRunner.query(`ALTER TABLE "checkouts" ADD "status" "public"."checkouts_status_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkouts" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."checkouts_status_enum"`);
    }

}
