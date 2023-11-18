/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../../club/club.entity';
import { MemberEntity } from '../../member/member.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [MemberEntity, ClubEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([MemberEntity, ClubEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/