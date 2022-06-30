import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class Story {

    @PrimaryGeneratedColumn()
    id: number

    @PrimaryGeneratedColumn()
    sId: number

    @Column()
    name: string

    @Column()
    slug: string

    @Column()
    authorName: string

    @Column({ nullable: true })
    hashAuthor: string

    @Column({ nullable: true, type: 'text', array: true })
    hashAuthorSite: string[]

    @Column()
    authorSlug: string

    @Column()
    imagePathSrc: string

    @Column()
    imagePathRaw: string

    @Column({ nullable: true })
    hashImagePath: string

    @Column({ nullable: true, type: 'text', array: true })
    hashImagePathSite: string[]

    @Column()
    status: string

    @Column({ nullable: true })
    hashStatus: string

    @Column({ nullable: true, type: 'text', array: true })
    hashStatusSite: string[]

    @Column({ type: 'text', array: true, nullable: true })
    categories: string[]

    @Column({ nullable: true })
    hashCategories: string

    @Column({ nullable: true, type: 'text', array: true })
    hashCategoriesSite: string[]

    @Column({ type: 'text', array: true, nullable: true })
    tags: string[]

    @Column({ nullable: true })
    hashTags: string

    @Column({ nullable: true, type: 'text', array: true })
    hashTagsSite: string[]

    @Column()
    chapterPathRaw: string

    @Column()
    outsideChaptersLength: number

    @Column()
    insideChaptersLength: number

    @Column()
    hasChapterNeedContent: boolean

    @Column()
    outsideSrc: string

    @Column()
    outsideSVC: string

    @Column()
    language: 'ch' | 'vi'| 'en'
}
