import { Logger, NotFoundException } from '@nestjs/common'
import {
    FilterQuery,
    Model,
    Types,
    UpdateQuery,
    SaveOptions,
    Connection,
    ClientSession,
} from 'mongoose'
import { AbstractDocument } from './abstract.schema'

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger

    constructor(
        protected readonly model: Model<TDocument>,
        private readonly connection: Connection,
    ) {}

    async create(
        document: Partial<TDocument> & { _id?: Types.ObjectId },
        options?: SaveOptions,
    ): Promise<TDocument> {
        const createdDocument = new this.model(document)
        return (
            await createdDocument.save(options)
        ).toJSON() as unknown as TDocument
    }

    // async create(
    //     document: Omit<TDocument, '_id'>,
    //     options?: SaveOptions,
    // ): Promise<TDocument> {
    //     const createdDocument = new this.model({
    //         ...document,
    //         _id: new Types.ObjectId(),
    //     })
    //     return (
    //         await createdDocument.save(options)
    //     ).toJSON() as unknown as TDocument
    // }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = (await this.model.findOne(
            filterQuery,
            {},
            { lean: true },
        )) as TDocument

        if (!document) {
            return undefined
            // this.logger.warn('Document not found with filterQuery', filterQuery);
            // throw new NotFoundException('Document not found.');
        }

        return document
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ) {
        const document = await this.model.findOneAndUpdate(
            filterQuery,
            update,
            {
                lean: true,
                new: true,
            },
        )

        if (!document) {
            this.logger.warn(
                `Document not found with filterQuery:`,
                filterQuery,
            )
            throw new NotFoundException('Document not found.')
        }

        return document
    }

    async upsert(
        filterQuery: FilterQuery<TDocument>,
        document: Partial<TDocument>,
    ) {
        return this.model.findOneAndUpdate(filterQuery, document, {
            lean: true,
            upsert: true,
            new: true,
        })
    }

    async find(filterQuery: FilterQuery<TDocument>) {
        return this.model.find(filterQuery, {}, { lean: true })
    }

    async startTransaction(): Promise<ClientSession> {
        const session = await this.connection.startSession()
        session.startTransaction()
        return session
    }

    async updateMany(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ): Promise<TDocument[]> {
        const result = await this.model.updateMany(filterQuery, update, {
            lean: true,
        })

        if (result.modifiedCount === 0) {
            this.logger.warn(
                `No documents were updated with filterQuery:`,
                filterQuery,
            )
            throw new NotFoundException('No documents found to update.')
        }

        return this.model.find(
            filterQuery,
            {},
            { lean: true },
        ) as unknown as TDocument[]
    }

    async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<void> {
        const result = await this.model.deleteOne(filterQuery).exec()

        if (result.deletedCount === 0) {
            this.logger.warn(
                `No documents found to delete with filterQuery:`,
                filterQuery,
            )
            throw new NotFoundException('Document not found to delete.')
        }
    }

    async deleteMany(filterQuery: FilterQuery<TDocument>): Promise<void> {
        const result = await this.model.deleteMany(filterQuery).exec()

        if (result.deletedCount === 0) {
            this.logger.warn(
                `No documents found to delete with filterQuery:`,
                filterQuery,
            )
            throw new NotFoundException('Documents not found to delete.')
        }
    }
}
