import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  async findAll(options?: {
    page?: number;
    pageSize?: number;
    sortBy?: "id" | "fullName" | "email" | "role";
    sortDir?: "ASC" | "DESC";
    search?: string;
  }) {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : 10;
    const allowedSort: Array<"id" | "fullName" | "email" | "role"> = ["id", "fullName", "email", "role"];
    const sortBy = options?.sortBy && allowedSort.includes(options.sortBy) ? options.sortBy : "id";
    const sortDir = options?.sortDir || "DESC";

    const qb = this.repo.createQueryBuilder("user");

    if (options?.search) {
      qb.where(
        "user.email ILIKE :search OR user.fullName ILIKE :search OR user.role ILIKE :search",
        { search: `%${options.search}%` }
      );
    }

    qb.orderBy(`user.${sortBy}`, sortDir)
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize };
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", { email })
      .getOne();
  }

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async update(id: number, dto: UpdateUserDto & { avatarUrl?: string; portfolioUrls?: string[] }) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
