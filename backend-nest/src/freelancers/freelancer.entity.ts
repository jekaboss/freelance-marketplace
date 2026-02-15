import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Freelancer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.freelancerProfiles, { eager: true })
  user: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  bio: string;

  @Column("text", { array: true, default: "{}" })
  skills: string[];

  @Column({ type: "numeric", nullable: true })
  hourlyRate: number;

  @Column({ nullable: true })
  location: string;
}
