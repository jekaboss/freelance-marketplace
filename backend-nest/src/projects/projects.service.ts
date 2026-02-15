import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./project.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
    private readonly usersService: UsersService
  ) {}

  async findAll(options?: {
    clientId?: number;
    page?: number;
    pageSize?: number;
    sortBy?: "id" | "title" | "status" | "budget" | "createdAt";
    sortDir?: "ASC" | "DESC";
    search?: string;
  }) {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 10;
    const allowedSort: Array<"id" | "title" | "status" | "budget" | "createdAt"> = [
      "id",
      "title",
      "status",
      "budget",
      "createdAt",
    ];
    const sortBy = options?.sortBy && allowedSort.includes(options.sortBy) ? options.sortBy : "createdAt";
    const sortDir = options?.sortDir || "DESC";

    const qb = this.repo.createQueryBuilder("project");

    if (options?.clientId) {
      qb.andWhere("project.clientId = :clientId", { clientId: options.clientId });
    }

    if (options?.search) {
      qb.andWhere("project.title ILIKE :search OR project.description ILIKE :search", {
        search: `%${options.search}%`,
      });
    }

    qb.orderBy(`project.${sortBy}`, sortDir)
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize };
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateProjectDto) {
    const client = await this.usersService.findOne(dto.clientId);
    const project = this.repo.create({
      client,
      title: dto.title,
      description: dto.description,
      budget: dto.budget,
      status: "open"
    });
    return this.repo.save(project);
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
