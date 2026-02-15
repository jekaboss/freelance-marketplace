import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(
    @Query("clientId") clientId?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("sortBy") sortBy?: "id" | "title" | "status" | "budget" | "createdAt",
    @Query("sortDir") sortDir?: "ASC" | "DESC",
    @Query("search") search?: string
  ) {
    return this.projectsService.findAll({
      clientId: clientId ? Number(clientId) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sortBy,
      sortDir,
      search,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(Number(id));
  }
}
