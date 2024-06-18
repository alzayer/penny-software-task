import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://Mahdi70:VSm7k.9.yz%23W-5x@penny.zhl6bbw.mongodb.net/?retryWrites=true&w=majority&appName=Penny'),
    AuthModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
