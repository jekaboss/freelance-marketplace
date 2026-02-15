import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  client: User;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({ type: "numeric", nullable: true })
  budget: number;

  @Column({ default: "open" })
  status: "open" | "in_progress" | "completed";

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
