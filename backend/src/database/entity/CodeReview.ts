import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CodeReview {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({
		nullable: false,
	})
	snippetName!: string;

	@Column({
		nullable: false,
	})
	code!: string;

	@Column({
		nullable: false,
	})
	review!: string;

	@CreateDateColumn()
	createdAt!: Date;
}
