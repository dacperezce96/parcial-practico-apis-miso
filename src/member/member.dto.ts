/* eslint-disable prettier/prettier */
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class MemberDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    dateBirth: Date;

}