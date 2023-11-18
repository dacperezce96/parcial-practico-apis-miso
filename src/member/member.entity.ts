/* eslint-disable prettier/prettier */
import { ClubEntity } from "../club/club.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity()
export class MemberEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    username: string;
    
    @Column()
    email: string;

    @Column({type: 'date'})
    dateBirth: Date;

    @ManyToMany(() => ClubEntity, club => club.members)
    clubs: ClubEntity[];
}