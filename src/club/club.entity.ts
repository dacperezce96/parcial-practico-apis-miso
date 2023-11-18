/* eslint-disable prettier/prettier */
import { MemberEntity } from "src/member/member.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    name: string;

    @Column({type: 'date'})
    dateFoundation: Date;
    
    @Column()
    urlImg: string;

    @Column()
    description: string;

    @ManyToMany(() => MemberEntity, member => member.clubs)
    members: MemberEntity[];


}
