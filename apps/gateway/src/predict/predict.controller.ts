import { Controller, Delete, Post } from '@nestjs/common'
import { PredictService } from './predict.service'

@Controller('predict')
export class PredictController {
    constructor(private readonly predictService: PredictService) {}

    @Post()
    async predict() {
<<<<<<< HEAD
        console.log('ok')
        return this.predictService.createPrddict()
       
    }

    @Delete()
    async delete(){
        return this.predictService.deleteData()
=======
        return this.predictService.createPrddict()
>>>>>>> e02d3b6d2d07b2b108822ba120f0da75770ccefb
    }
}
