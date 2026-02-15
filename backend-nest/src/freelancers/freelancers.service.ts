import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Freelancer } from "./freelancer.entity";
import { CreateFreelancerDto } from "./dto/create-freelancer.dto";
import { UpdateFreelancerDto } from "./dto/update-freelancer.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class FreelancersService {
  constructor(
    @InjectRepository(Freelancer)
    private readonly repo: Repository<Freelancer>,
    private readonly usersService: UsersService
  ) {}

  async findAll(options?: {
    userId?: number;
    page?: number;
    pageSize?: number;
    sortBy?: "id" | "title" | "hourlyRate" | "location";
    sortDir?: "ASC" | "DESC";
    search?: string;
  }) {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 10;
    const allowedSort: Array<"id" | "title" | "hourlyRate" | "location"> = [
      "id",
      "title",
      "hourlyRate",
      "location",
    ];
    const sortBy = options?.sortBy && allowedSort.includes(options.sortBy) ? options.sortBy : "id";
    const sortDir = options?.sortDir || "DESC";

    const qb = this.repo.createQueryBuilder("freelancer");

    if (options?.userId) {
      qb.andWhere("freelancer.userId = :userId", { userId: options.userId });
    }

    if (options?.search) {
      qb.andWhere(
        "freelancer.title ILIKE :search OR freelancer.bio ILIKE :search OR freelancer.location ILIKE :search",
        { search: `%${options.search}%` }
      );
    }

    qb.orderBy(`freelancer.${sortBy}`, sortDir)
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize };
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateFreelancerDto) {
    const user = await this.usersService.findOne(dto.userId);
    const freelancer = this.repo.create({
      user,
      title: dto.title,
      bio: dto.bio,
      skills: dto.skills || [],
      hourlyRate: dto.hourlyRate,
      location: dto.location
    });
    return this.repo.save(freelancer);
  }

  async update(id: number, dto: UpdateFreelancerDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
