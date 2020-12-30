import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createGoalTable1607590446829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const guildConfigTable = new Table({
      name: 'goals',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
        },
        {
          name: 'target',
          type: 'int',
        },
        {
          name: 'goal_type',
          type: 'enum',
          enum: ['lines', 'minutes', 'pages', 'words'],
        },
        {
          name: 'progress',
          type: 'int',
        },
        {
          name: 'owner_id',
          type: 'varchar',
          length: '30',
        },
        {
          name: 'channel_id',
          type: 'varchar',
          length: '30',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'canceled_at',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'completed_at',
          type: 'timestamp',
          isNullable: true,
        },
      ],
    })

    await queryRunner.createTable(guildConfigTable, true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('goals')
  }
}