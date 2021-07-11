import { Logger } from '@nestjs/common';
import { getConnection, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

const TABLE_NAME = 'user'; // user table name

export const createAdmin = async ({
  PG_DB,
  PASSWORD_ADMIN,
  LOGIN_ADMIN,
}: {
  PG_DB: string;
  PASSWORD_ADMIN: string;
  LOGIN_ADMIN: string;
}): Promise<void> => {
  try {
    const connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    const isHasDB = await queryRunner.hasDatabase(<string>PG_DB);

    if (!isHasDB) {
      throw Error(`${PG_DB} database does not exist, check config file`);
    }

    const isHasTable = await queryRunner.hasTable(TABLE_NAME);

    if (!isHasTable) {
      const resultMigration = await connection.runMigrations();

      if (resultMigration.length === 0) {
        throw Error(
          `No migration file was found, to generate the migration file, run the command: npm run migration:generation -n <nameMigration>, also restart app!`,
        );
      }

      Logger.log(
        `Migration was perfomed with yhe following parameters: ${JSON.stringify(resultMigration)}`,
      );
    }

    const isAdmin = await connection.getRepository(User).findOne({ login: LOGIN_ADMIN });

    if (isAdmin === undefined) {
      const hashedPassword = await bcrypt.hash(<string>PASSWORD_ADMIN, 10);

      const admin = connection
        .getRepository(User)
        .create({ name: 'Admin', login: <string>LOGIN_ADMIN, password: hashedPassword });
      await connection.getRepository(User).save(admin);
    }
  } catch (e) {
    throw Error(e);
  }
};
