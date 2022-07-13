import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Story {
  @PrimaryColumn()
  id: string;

  @Column()
  sId: string;

  @Column()
  name: string;

  @Column()
  hashName: string;

  @Column({ nullable: true })
  hashNameSite: string;

  @Column()
  slug: string;

  @Column()
  authorName: string;

  @Column({ nullable: true })
  hashAuthor: string;

  @Column({ nullable: true, type: "text", array: true })
  hashAuthorSite: string[];

  @Column()
  authorSlug: string;

  @Column()
  imagePathSrc: string;

  @Column({ nullable: true })
  hashImagePathSrc: string;

  @Column({ nullable: true })
  imagePathRaw: string;

  @Column({ nullable: true })
  hashImagePathRaw: string;

  @Column({ nullable: true, type: "text", array: true })
  hashImagePathSite: string[];

  @Column()
  status: string;

  @Column({ nullable: true })
  hashStatus: string;

  @Column({ nullable: true, type: "text", array: true })
  hashStatusSite: string[];

  @Column({ type: "text", array: true, nullable: true })
  categories: string[];

  @Column({ nullable: true })
  hashCategories: string;

  @Column({ nullable: true, type: "text", array: true })
  hashCategoriesSite: string[];

  @Column({ type: "text", array: true, nullable: true })
  tags: string[];

  @Column({ nullable: true })
  hashTags: string;

  @Column({ nullable: true, type: "text", array: true })
  hashTagsSite: string[];

  @Column({ nullable: true })
  chapterPathRaw: string;

  @Column({ default: 0 })
  outsideChaptersLength: number;

  @Column({ nullable: true, default: 0 })
  insideChaptersLength: number;

  @Column({ nullable: true, default: 0 })
  insideChaptersContentLength: number;

  @Column()
  outsideSrc: string;

  @Column()
  outsideSVC: string;

  @Column()
  language: "ch" | "vi" | "en";

  constructor(item) {
    for (const key in item) {
      this[key] = item[key];
    }
  }
}
