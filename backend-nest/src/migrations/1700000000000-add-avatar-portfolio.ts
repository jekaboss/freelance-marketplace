import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAvatarPortfolio1700000000000 implements MigrationInterface {
  name = "AddAvatarPortfolio1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "avatarUrl",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "portfolioUrls",
        type: "text",
        isArray: true,
        default: "{}",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user", "portfolioUrls");
    await queryRunner.dropColumn("user", "avatarUrl");
  }
}
