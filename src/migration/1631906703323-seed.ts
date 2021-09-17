import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class seed1631906022413 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = 'admin1!';
    const salt = Date.now().toString();
    const hashSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(salt + password, hashSalt);

    await queryRunner.query(
      `INSERT INTO "user"(firstname, lastname, username, password, salt, "isAdmin") 
      VALUES ('Admin', 'Admin', 'admin', '${hashedPassword}', '${salt}',true);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user WHERE username = 'admin';`);
  }
}
