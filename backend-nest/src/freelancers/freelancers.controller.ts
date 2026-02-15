import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { FreelancersService } from "./freelancers.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CreateFreelancerDto } from "./dto/create-freelancer.dto";
import { UpdateFreelancerDto } from "./dto/update-freelancer.dto";

@Controller("freelancers")
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Get()
  findAll(
    @Query("userId") userId?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("sortBy") sortBy?: "id" | "title" | "hourlyRate" | "location",
    @Query("sortDir") sortDir?: "ASC" | "DESC",
    @Query("search") search?: string
  ) {
    return this.freelancersService.findAll({
      userId: userId ? Number(userId) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sortBy,
      sortDir,
      search,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.freelancersService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFreelancerDto) {
    return this.freelancersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateFreelancerDto) {
    return this.freelancersService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.freelancersService.remove(Number(id));
  }
}
