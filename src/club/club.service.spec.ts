/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService]
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase()
  });

  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i = 0; i < 5; i++){
      const club: ClubEntity = await repository.save({
        name: faker.company.name(),
        dateFoundation: faker.date.anytime(),
        urlImg: faker.image.url(),
        description: faker.lorem.paragraphs(5).substring(0, 100)
      })
      clubList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length)
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubList[0];
    const club:ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('create should return a new club', async () =>{
    const club: ClubEntity = {
      id:"",
      name: faker.company.name(),
      dateFoundation: faker.date.anytime(),
      urlImg: faker.image.url(),
      description: faker.lorem.paragraphs(5).substring(0, 100),
      members:[]
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where:{id: newClub.id}});
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(newClub.name);

  })

  it('create should throw an exception for a repeated nombre', async () =>{
    const club: ClubEntity = {
      id:"",
      name: clubList[0].name,
      dateFoundation: faker.date.anytime(),
      urlImg: faker.image.url(),
      description: faker.lorem.paragraphs(5).substring(0, 100),
      members:[]
    }

    await expect(() => service.create(club)).rejects.toHaveProperty("message", "There is already a club with that name")

  })

  it('create should throw an exception for a too long description', async () =>{
    const club: ClubEntity = {
      id:"",
      name: faker.company.name(),
      dateFoundation: faker.date.anytime(),
      urlImg: faker.image.url(),
      description: faker.lorem.paragraphs(5).substring(0, 101),
      members:[]
    }

    await expect(() => service.create(club)).rejects.toHaveProperty("message", "Description too long")

  })

  it('update should modify a club', async () => {
    const club: ClubEntity = clubList[0];
    club.name = "New name";
    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(club.name)
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, name: "New name"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('update should throw an exception for an repeated name', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, name: clubList[1].name
    }
    await expect(() => service.update(club.id, club)).rejects.toHaveProperty("message", "There is already a club with that name")
  });

  it('update should throw an exception for an too long description', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, description: faker.lorem.paragraphs(5).substring(0, 101)
    }
    await expect(() => service.update(club.id, club)).rejects.toHaveProperty("message", "Description too long")
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

});
