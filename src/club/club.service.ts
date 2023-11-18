/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async findAll(): Promise<ClubEntity[]>{
        return await this.clubRepository.find({
            relations: [
                "members"
            ]
        });
    }

    async findOne(id: string): Promise<ClubEntity>{
        const club: ClubEntity = await this.clubRepository.findOne({
            where: {id},
            relations: [
                "members"
            ]
        });
        if(!club){
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        }            
        return club
    }

    async create(club:ClubEntity): Promise<ClubEntity>{
        const clubes: ClubEntity[] = await this.clubRepository.find({
            where: {name: club.name}
        })
        if (clubes.length > 0){
            throw new BusinessLogicException("There is already a club with that name", BusinessError.PRECONDITION_FAILED);
        }
        if (club.description.length > 100){
            throw new BusinessLogicException("Description too long", BusinessError.BAD_REQUEST);
        }
        return await this.clubRepository.save(club)
    }

    async update(id:string, club:ClubEntity): Promise<ClubEntity>{
        const persistedclub: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if(!persistedclub){
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        }
        if(club.name && (club.name != persistedclub.name)){
            const clubes: ClubEntity[] = await this.clubRepository.find({
                where: {name: club.name}
            })
            if (clubes.length > 0){
                throw new BusinessLogicException("There is already a club with that name", BusinessError.PRECONDITION_FAILED);
            }
        }
        if (club.description.length > 100){
            throw new BusinessLogicException("Description too long", BusinessError.BAD_REQUEST);
        }
        return await this.clubRepository.save({...persistedclub, ...club});
    }

    async delete(id:string){
        const club:ClubEntity = await this.clubRepository.findOne({where:{id}});
        if(!club){
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.clubRepository.remove(club);
    }
}
