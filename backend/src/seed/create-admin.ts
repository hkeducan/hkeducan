import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'hkeducan',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'hkeducan',
  entities: [User],
  synchronize: true,
});

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const exists = await repo.findOne({ where: { email: 'admin@hkeducan.local' } });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const u = new User();
  u.email = 'admin@hkeducan.local';
  u.name = 'Administrator';
  u.passwordHash = await bcrypt.hash('changeme123', 10);
  u.role = 'ADMIN' as any;
  u.status = 'ENABLED' as any;
  await repo.save(u);
  console.log('Admin created: admin@hkeducan.local / changeme123');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
