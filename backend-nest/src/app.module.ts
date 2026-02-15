import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { FreelancersModule } from "./freelancers/freelancers.module";
import { ProjectsModule } from "./projects/projects.module";
import { User } from "./users/user.entity";
import { Freelancer } from "./freelancers/freelancer.entity";
import { Project } from "./projects/project.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DATABASE_HOST"),
        port: Number(config.get<string>("DATABASE_PORT")),
        username: config.get<string>("DATABASE_USER"),
        password: config.get<string>("DATABASE_PASSWORD"),
        database: config.get<string>("DATABASE_NAME"),
        entities: [User, Freelancer, Project],
        synchronize: true
      })
    }),
    AuthModule,
    UsersModule,
    FreelancersModule,
    ProjectsModule
  ]
})
export class AppModule {}
