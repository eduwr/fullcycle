import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { MapsModule } from 'src/maps/maps.module';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService],
  imports: [MapsModule],
})
export class RoutesModule {}
