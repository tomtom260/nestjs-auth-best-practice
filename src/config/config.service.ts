import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import fs = require('fs');

class ConfigService {
  constructor(
    private readonly env: { [k: string]: string | undefined },
    keys: string[],
  ) {
    this.ensureValues(keys);
    this.writeOrmConfig();
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  private ensureValues(keys: string[]) {
    setTimeout(() => {
      keys.forEach((k) => this.getValue(k, true));
    }, 0);
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getRefreshJWTSecret() {
    return this.getValue('JWT_REFRESH', true);
  }

  public getAccessJWTSecret() {
    return this.getValue('JWT_ACCESS', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode === 'PROD';
  }

  private writeOrmConfig(): void {
    setTimeout(() => {
      fs.writeFileSync(
        'ormconfig.json',
        JSON.stringify(configService.getTypeOrmConfig(), null, 2),
      );
    }, 0);
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrationsTableName: 'migration',
      migrations: ['dist/migration/*.js'],
      cli: {
        migrationsDir: 'src/migration',
        entitiesDir: 'src/entity',
      },
      ssl: this.isProduction(),
      synchronize: false,
    };
  }
}

const configService = new ConfigService(process.env, [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'JWT_REFRESH',
  'JWT_ACCESS',
]);

export { configService };
