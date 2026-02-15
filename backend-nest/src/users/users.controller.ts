import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  ForbiddenException,
  Req,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";

const uploadsRoot = path.join(process.cwd(), "uploads");
const avatarDir = path.join(uploadsRoot, "avatars");
const portfolioDir = path.join(uploadsRoot, "portfolio");
const allowedPortfolio = [".pdf", ".png", ".jpg", ".jpeg"];

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function fileName(_: unknown, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
  const ext = path.extname(file.originalname);
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  cb(null, name);
}

function imageFileFilter(_: unknown, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new BadRequestException("Only image files are allowed"), false);
  }
  cb(null, true);
}

function portfolioFileFilter(_: unknown, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedPortfolio.includes(ext)) {
    return cb(new BadRequestException("Unsupported file type"), false);
  }
  cb(null, true);
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("sortBy") sortBy?: "id" | "fullName" | "email" | "role",
    @Query("sortDir") sortDir?: "ASC" | "DESC",
    @Query("search") search?: string
  ) {
    return this.usersService.findAll({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sortBy,
      sortDir,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureDir(avatarDir);
          cb(null, avatarDir);
        },
        filename: fileName,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  async uploadAvatar(
    @Param("id") id: string,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: { user?: { sub?: number; role?: string } }
  ) {
    const requester = req?.user;
    if (requester && requester.sub !== Number(id) && requester.role !== "admin") {
      throw new ForbiddenException("Forbidden");
    }
    if (!file) {
      throw new BadRequestException("File is required");
    }
    const url = `/uploads/avatars/${file.filename}`;
    await this.usersService.update(Number(id), { avatarUrl: url } as any);
    return { userId: Number(id), url };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/avatar")
  async deleteAvatar(
    @Param("id") id: string,
    @Req() req?: { user?: { sub?: number; role?: string } }
  ) {
    const requester = req?.user;
    if (requester && requester.sub !== Number(id) && requester.role !== "admin") {
      throw new ForbiddenException("Forbidden");
    }
    const user = await this.usersService.findOne(Number(id));
    const avatarUrl = user?.avatarUrl;
    if (avatarUrl) {
      const filePath = path.join(process.cwd(), avatarUrl.replace("/uploads/", "uploads/"));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await this.usersService.update(Number(id), { avatarUrl: null } as any);
    return { userId: Number(id), deleted: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/portfolio")
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureDir(portfolioDir);
          cb(null, portfolioDir);
        },
        filename: fileName,
      }),
      fileFilter: portfolioFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
  async uploadPortfolio(
    @Param("id") id: string,
    @UploadedFiles() files?: Express.Multer.File[],
    @Req() req?: { user?: { sub?: number; role?: string } }
  ) {
    const requester = req?.user;
    if (requester && requester.sub !== Number(id) && requester.role !== "admin") {
      throw new ForbiddenException("Forbidden");
    }
    if (!files || files.length === 0) {
      throw new BadRequestException("Files are required");
    }
    const urls = files.map((file) => `/uploads/portfolio/${file.filename}`);
    const user = await this.usersService.findOne(Number(id));
    const portfolio = [...(user?.portfolioUrls || []), ...urls];
    await this.usersService.update(Number(id), { portfolioUrls: portfolio } as any);
    return { userId: Number(id), urls };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/portfolio")
  async deletePortfolioItem(
    @Param("id") id: string,
    @Query("url") url?: string,
    @Req() req?: { user?: { sub?: number; role?: string } }
  ) {
    const requester = req?.user;
    if (requester && requester.sub !== Number(id) && requester.role !== "admin") {
      throw new ForbiddenException("Forbidden");
    }
    if (!url) {
      throw new BadRequestException("url is required");
    }
    const user = await this.usersService.findOne(Number(id));
    const portfolio = (user?.portfolioUrls || []).filter((item) => item !== url);
    await this.usersService.update(Number(id), { portfolioUrls: portfolio } as any);

    const filePath = path.join(process.cwd(), url.replace("/uploads/", "uploads/"));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { userId: Number(id), deleted: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }
}
