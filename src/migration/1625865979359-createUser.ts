import {MigrationInterface, QueryRunner} from "typeorm";

export class createUser1625865979359 implements MigrationInterface {
    name = 'createUser1625865979359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, "name" character varying(50) NOT NULL, "login" character varying(50) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
