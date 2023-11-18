/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { Repository } from 'typeorm';
import { MemberEntity } from './member.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<MemberEntity>;
  let memberList: MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MemberService]
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity));
    await seedDatabase()
  });

  const seedDatabase = async () => {
    repository.clear();
    memberList = [];
    for(let i = 0; i < 5; i++){
      const member: MemberEntity = await repository.save({
        username: faker.company.name(),
        dateBirth: faker.date.birthdate(),
        email: faker.internet.email()
      })
      memberList.push(member);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('findAll should return all members', async () => {
    const members: MemberEntity[] = await service.findAll();
    expect(members).not.toBeNull();
    expect(members).toHaveLength(memberList.length)
  });

  it('findOne should return a member by id', async () => {
    const storedMember: MemberEntity = memberList[0];
    const member:MemberEntity = await service.findOne(storedMember.id);
    expect(member).not.toBeNull();
    expect(member.username).toEqual(storedMember.username);
  });

  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('create should return a new member', async () =>{
    const member: MemberEntity = {
      id:"",
      username: faker.company.name(),
      dateBirth: faker.date.birthdate(),
      email: faker.internet.email(),
      clubs:[]
    }

    const newMember: MemberEntity = await service.create(member);
    expect(newMember).not.toBeNull();

    const storedMember: MemberEntity = await repository.findOne({where:{id: newMember.id}});
    expect(storedMember).not.toBeNull();
    expect(storedMember.username).toEqual(newMember.username);

  })

  it('create should throw an exception for a repeated nombre', async () =>{
    const member: MemberEntity = {
      id:"",
      username: memberList[0].username,
      dateBirth: faker.date.birthdate(),
      email: faker.internet.email(),
      clubs:[]
    }

    await expect(() => service.create(member)).rejects.toHaveProperty("message", "There is already a member with that username")

  })

  it('create should throw an exception for a invalid email', async () =>{
    const member: MemberEntity = {
      id:"",
      username: faker.company.name(),
      dateBirth: faker.date.birthdate(),
      email: "invalidemail",
      clubs:[]
    }

    await expect(() => service.create(member)).rejects.toHaveProperty("message", "Invalid email")

  })

  it('update should modify a member', async () => {
    const member: MemberEntity = memberList[0];
    member.username = "New username";
    const updatedMember: MemberEntity = await service.update(member.id, member);
    expect(updatedMember).not.toBeNull();
    const storedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(storedMember).not.toBeNull();
    expect(storedMember.username).toEqual(member.username)
  });

  it('update should throw an exception for an invalid member', async () => {
    let member: MemberEntity = memberList[0];
    member = {
      ...member, username: "New username"
    }
    await expect(() => service.update("0", member)).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('update should throw an exception for an repeated username', async () => {
    let member: MemberEntity = memberList[0];
    member = {
      ...member, username: memberList[1].username
    }
    await expect(() => service.update(member.id, member)).rejects.toHaveProperty("message", "There is already a member with that username")
  });

  it('update should throw an exception for a invalid email', async () => {
    let member: MemberEntity = memberList[0];
    member = {
      ...member, email: "invalidemail"
    }
    await expect(() => service.update(member.id, member)).rejects.toHaveProperty("message", "Invalid email")
  });

  it('delete should remove a member', async () => {
    const member: MemberEntity = memberList[0];
    await service.delete(member.id);
    const deletedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(deletedMember).toBeNull();
  });

  it('delete should throw an exception for an invalid member', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });
});
