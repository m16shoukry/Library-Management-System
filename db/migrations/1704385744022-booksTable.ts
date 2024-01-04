import { MigrationInterface, QueryRunner } from "typeorm";

export class BooksTable1704385744022 implements MigrationInterface {
    name = 'BooksTable1704385744022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "books" ("id" BIGSERIAL NOT NULL, "ISBN" character varying NOT NULL, "title" character varying NOT NULL, "quantity" integer NOT NULL, "author" character varying NOT NULL, "shelf" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a5dcb40d5802b60362ff72d62d" ON "books" ("ISBN") `);
        await queryRunner.query(`CREATE INDEX "IDX_3cd818eaf734a9d8814843f119" ON "books" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_4675aad2c57a7a793d26afbae9" ON "books" ("author") `);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4675aad2c57a7a793d26afbae9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3cd818eaf734a9d8814843f119"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5dcb40d5802b60362ff72d62d"`);
        await queryRunner.query(`DROP TABLE "books"`);
    }

}
