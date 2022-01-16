import {MigrationInterface, QueryRunner} from "typeorm";

export class user1642246626120 implements MigrationInterface {
    name = 'user1642246626120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "usedRefreshTokens" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "usedRefreshTokens"`);
    }

}
