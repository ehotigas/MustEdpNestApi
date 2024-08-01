import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  
  const config = new DocumentBuilder().setTitle(
    'Projeto Alarmes'
  ).setDescription(
    'API para o projeto de alarmes'
  ).setVersion(
    '1.0'
  ).build();
  // .addBearerAuth({ 
  //   // I was also testing it without prefix 'Bearer ' before the JWT
  //   description: `Please enter token in following format: Bearer <JWT>`,
  //   name: 'Authorization',
  //   bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
  //   scheme: 'Bearer',
  //   type: 'http', // I`ve attempted type: 'apiKey' too
  //   in: 'Header'
  // }).build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(4041);
}
bootstrap();
