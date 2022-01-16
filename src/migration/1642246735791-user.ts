import {MigrationInterface, QueryRunner} from "typeorm";

export class user1642246735791 implements MigrationInterface {
    name = 'user1642246735791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "usedRefreshTokens" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "usedRefreshTokens" DROP DEFAULT`);
    }

}
