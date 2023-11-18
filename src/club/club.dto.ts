/* eslint-disable prettier/prettier */
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class ClubDto {

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @IsDateString()
    dateFoundation: Date;
    
    @IsString()
    @IsNotEmpty()
    urlImg: string;

    
    @IsString()
    @IsNotEmpty()
    description: string;

}