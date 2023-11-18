/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MemberDto } from 'src/member/member.dto';
import { MemberEntity } from 'src/member/member.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ClubMemberService } from './club-member.service';

@Controller('club')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubMemberController {
    constructor(private readonly clubMemberService: ClubMemberService){}

    @Post(':clubId/member/:memberId')
    async addMemberClub(@Param('clubId') clubId:string, @Param('memberId') memberId:string){
        return this.clubMemberService.addMemberToClub(clubId, memberId);
    }

    @Get(':clubId/member/:memberId')
    async findMemberByClubIdMemberId(@Param('clubId') clubId:string, @Param('memberId') memberId:string){
        return this.clubMemberService.findMemberFromClub(clubId, memberId);
    }

    @Get(':clubId/member')
    async findMemberesByClubId(@Param('clubId') clubId:string){
        return this.clubMemberService.findMembersFromClub(clubId);
    }

    @Put(':clubId/member')
    async associateMemberClub(@Body() memberesDto: MemberDto[], @Param('clubId') clubId:string){
        const memberes = plainToInstance(MemberEntity, memberesDto)
        return await this.clubMemberService.updateMembersFromClub(clubId, memberes)
    }

    @Delete(':clubId/member/:memberId')
    @HttpCode(204)
    async deleteArtworkMuseum(@Param('clubId') clubId:string, @Param('memberId') memberId:string){
        return await this.clubMemberService.deleteMemberFromClub(clubId, memberId);
    }
}
