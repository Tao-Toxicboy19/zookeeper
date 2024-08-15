import { Controller, Delete, Post } from '@nestjs/common'
import { PredictService } from './predict.service'

@Controller('predict')
export class PredictController {
    constructor(private readonly predictService: PredictService) {}

    @Post()
    async predict() {
        console.log('ok')
        return this.predictService.createPrddict()
       
    }

    @Delete()
    async delete(){
        return this.predictService.deleteData()
    }
}
