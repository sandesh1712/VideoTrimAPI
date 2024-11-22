import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Video {
    @PrimaryGeneratedColumn() 
    id:number
    
    @Column()
    size:number
   
    @ManyToOne(()=>User,u => u.videos,{eager:true})
    user:User

    @Column()
    title:string

    @Column({type:'text'})
    description:string

    @Column()
    s3Url:string

    @Column()
    originalName:string

    @Column()
    s3Key:string

    @Column()
    duration:number
}