import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import petRoutes from './routes/pet.routes';
import appointmentRoutes from './routes/appointment.routes';
import productRoutes from './routes/product.routes';

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errorHandler();
    }

    private config(): void {
        const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*';

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors({
            origin: allowedOrigins,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true
        }));
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    private routes(): void {
        // Basic health check
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ status: 'OK', timestamp: new Date() });
        });

        // Swagger documentation
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'VetCare API',
                    version: '1.0.0',
                    description: 'API for a veterinary clinic management system',
                },
                servers: [
                    {
                        url: 'http://localhost:3000/api/v1',
                    },
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                    },
                },
            },
            apis: ['./src/routes/*.ts'],
        };
        const swaggerDocs = swaggerJsdoc(swaggerOptions);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

        // API Routes
        this.app.use('/api/v1/auth', authRoutes);
        this.app.use('/api/v1/pets', petRoutes);
        this.app.use('/api/v1/appointments', appointmentRoutes);
        this.app.use('/api/v1/products', productRoutes);
    }

    private errorHandler(): void {
        this.app.use(errorMiddleware);
    }
}

export default new App().app;
