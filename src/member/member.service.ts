/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MemberEntity } from './member.entity';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>
    ){}

    async findAll(): Promise<MemberEntity[]>{
        return await this.memberRepository.find({
            relations: [
                "clubs"
            ]
        });
    }

    async findOne(id: string): Promise<MemberEntity>{
        const member: MemberEntity = await this.memberRepository.findOne({
            where: {id},
            relations: [
                "clubs"
            ]
        });
        if(!member){
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
        }            
        return member
    }

    async create(member:MemberEntity): Promise<MemberEntity>{
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const memberes: MemberEntity[] = await this.memberRepository.find({
            where: {username: member.username}
        })
        if (memberes.length > 0){
            throw new BusinessLogicException("There is already a member with that username", BusinessError.PRECONDITION_FAILED);
        }
        if (!regexEmail.test(member.email)){
            throw new BusinessLogicException("Invalid email", BusinessError.BAD_REQUEST);
        }
        return await this.memberRepository.save(member)
    }

    async update(id:string, member:MemberEntity): Promise<MemberEntity>{
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const persistedmember: MemberEntity = await this.memberRepository.findOne({where:{id}});
        if(!persistedmember){
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
        }
        if(member.username && (member.username != persistedmember.username)){
            const memberes: MemberEntity[] = await this.memberRepository.find({
                where: {username: member.username}
            })
            if (memberes.length > 0){
                throw new BusinessLogicException("There is already a member with that username", BusinessError.PRECONDITION_FAILED);
            }
        }
        if (!regexEmail.test(member.email)){
            throw new BusinessLogicException("Invalid email", BusinessError.BAD_REQUEST);
        }
        return await this.memberRepository.save({...persistedmember, ...member});
    }

    async delete(id:string){
        const member:MemberEntity = await this.memberRepository.findOne({where:{id}});
        if(!member){
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.memberRepository.remove(member);
    }
}
