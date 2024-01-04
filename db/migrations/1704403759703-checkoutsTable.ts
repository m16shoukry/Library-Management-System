import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckoutsTable1704403759703 implements MigrationInterface {
    name = 'CheckoutsTable1704403759703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "checkouts" ("id" BIGSERIAL NOT NULL, "userId" bigint NOT NULL, "bookId" bigint NOT NULL, "startBorrowDate" TIMESTAMP NOT NULL DEFAULT now(), "endBorrowDate" TIMESTAMP NOT NULL, "returnedDate" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5800730d89f4137fc18770e4d4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "checkouts" ADD CONSTRAINT "FK_e077269fe39b9bff6f74c56bae1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkouts" ADD CONSTRAINT "FK_c11606d0104aa533a3a5697565d" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkouts" DROP CONSTRAINT "FK_c11606d0104aa533a3a5697565d"`);
        await queryRunner.query(`ALTER TABLE "checkouts" DROP CONSTRAINT "FK_e077269fe39b9bff6f74c56bae1"`);
        await queryRunner.query(`DROP TABLE "checkouts"`);
    }

}
