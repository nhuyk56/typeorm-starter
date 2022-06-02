import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class Story {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    slug: string

    @Column()
    authorName: string

    @Column()
    authorSlug: string

    @Column()
    imagePathRaw: string

    @Column()
    status: string

    @Column("int", { array: true })
    categories: string[]

    @Column("int", { array: true })
    tags: string[]

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
