import { Body, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class RoutesService {
  constructor(private prismaService: PrismaService) {

  }

  create(@Body() createRouteDto: CreateRouteDto) {

    console.log(createRouteDto)

    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        source: {
          name: createRouteDto.source_id,
          location: {
            lat: 0,
            lng: 0
          },

        },
        destination: {
          name: createRouteDto.destination_id,

          location: {
            lat: 0,
            lng: 0
          }

        },
        distance: 0,
        directions: '{}',
        duration: 0
      }
    })
  }

  findAll() {
    return this.prismaService.route.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
