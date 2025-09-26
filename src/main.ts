import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FeatureFlagMiddleware } from './middleware/feature-flag.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });

  await app.listen(3999);
}
bootstrap();
