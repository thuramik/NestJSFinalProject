import { Module } from '@nestjs/common';
import {CoffeesController} from "./coffees.controller";
import {CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/coffee.entity";
import {Flavor} from "./entities/flavor.entity";
import {Event} from "../events/entities/event.entity";
import {COFFEE_BRANDS} from "./coffees.constant";
import {ConfigModule} from "@nestjs/config";
import  coffeesConfig from "./coffees.config"

class MockCoffeesService {}
class ConfigService { }
class DevelopmentConfigService { }
class ProductionConfigService { }



@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule.forFeature(coffeesConfig)],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        {
            provide: ConfigService,
            useClass:
                process.env.NODE_ENV === 'development'
                    ? DevelopmentConfigService
                    : ProductionConfigService,
        },
        // {
        //     provide: CoffeesService,
        //     useValue: new MockCoffeesService(),
        // },
        // {
        //     provide: 'COFFEE_BRANDS',
        //     // Note "async" here, and Promise/Async event inside the Factory function
        //     // Could be a database connection / API call / etc
        //     // In our case we're just "mocking" this type of event with a Promise
        //     useFactory: async (connection: Connection): Promise<string[]> => {
        //         // const coffeeBrands = await connection.query('SELECT * ...');
        //         const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
        //         return coffeeBrands;
        //     },
        //     inject: [Connection],
        // },
        {
            provide: COFFEE_BRANDS,
            useValue: ['buddy brew', 'nescafe']
        }
    ],
    exports: [CoffeesService]
})
export class CoffeesModule {}
