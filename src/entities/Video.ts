import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Video {
    @PrimaryGeneratedColumn() 
    id:number
    
    @Column() 
    length:number //sec
   
    @ManyToOne(()=>User,u => u.videos)
    user:User

    @Column()
    title:string

    @Column({type:'text'})
    description:string
}