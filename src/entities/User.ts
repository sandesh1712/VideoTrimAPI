import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column({unique:true,nullable:false})
    email:string

    @Column({select:false})
    password:string
}