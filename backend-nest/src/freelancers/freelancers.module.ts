import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Freelancer } from "./freelancer.entity";
import { FreelancersService } from "./freelancers.service";
import { FreelancersController } from "./freelancers.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Freelancer]), UsersModule],
  providers: [FreelancersService],
  controllers: [FreelancersController]
})
export class FreelancersModule {}
