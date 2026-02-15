import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Freelancer } from "../freelancers/freelancer.entity";
import { Project } from "../projects/project.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ default: "client" })
  role: "client" | "freelancer" | "admin";

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column("text", { array: true, default: "{}" })
  portfolioUrls: string[];

  @OneToMany(() => Freelancer, (freelancer) => freelancer.user)
  freelancerProfiles: Freelancer[];

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}
