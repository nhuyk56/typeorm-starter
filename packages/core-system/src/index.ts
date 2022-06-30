import { AppDataSource } from "./data-source"
import { faker } from '@faker-js/faker';
import { Story } from "./entity/Story";
import { In } from "typeorm";

const main = async () => {
  // console.log("Inserting a new user into the database...")
  // const user = new User()
  // user.firstName = "Timber"
  // user.lastName = "Saw"
  // user.age = 25
  // await AppDataSource.manager.save(user)
  // console.log("Saved a new user with id: " + user.id)

  // console.log("Loading users from the database...")
  // const users = await AppDataSource.manager.find(User)
  // console.log("Loaded users: ", users)

  // console.log("Here you can setup and run express / fastify / any other framework.")

  const storyRepository = AppDataSource.getRepository(Story)

  // // clear
  // const stories1 = await storyRepository.find()
  // console.log(`will clear ${stories1.length} stories`)
  // await storyRepository.clear()

  // for (let index = 0; index < 300000; index++) {
  //   const story = new Story();
  //   story.name = faker.name.findName(),
  //   story.slug = story.name.replace(/ /, '-').toLowerCase(),
  //   story.authorName = faker.name.findName(),
  //   story.authorSlug = story.name.replace(/ /, '-').toLowerCase(),
  //   story.imagePathRaw = faker.internet.url(),
  //   story.status = faker.internet.httpStatusCode().toString(),
  //   story.categories = Array.from(Array(faker.datatype.number({ max: 10 })).keys()).map(i => faker.name.findName()),
  //   story.tags = Array.from(Array(faker.datatype.number({ max: 10 })).keys()).map(i => faker.name.findName()),
  //   story.chapterPathRaw = faker.internet.url(),
  //   story.outsideChaptersLength = faker.datatype.number(),
  //   story.insideChaptersLength = faker.datatype.number(),
  //   story.hasChapterNeedContent = faker.datatype.boolean(),
  //   story.outsideSrc = faker.name.findName(),
  //   story.outsideSVC = faker.name.findName(),
  //   story.language = 'vi'
  //   await storyRepository.save(story)
  //   console.log(`save story: ${index}`)
  // }

  console.time('storyRepository.find')
  const stories = await storyRepository
  .createQueryBuilder('story')
    // .where(`story.tags && ARRAY [:...tags]`, {
    //   tags: ['Jane Reinger', 'Annie Tillman', 'Traci Nienow']
    // })
    .where(`story.categories && array_append(ARRAY[NULL], story."outsideSVC")`)
    .getMany()

  // console.log("Loaded stories: ", stories)
  console.timeEnd('storyRepository.find')
  console.log('storyRepository.find', stories)

  // const user = new User();
  // user.firstName = 'Timber';
  // user.lastName = 'Saw';
  // user.age = 25;
  // await userRepository.save(user);

  // const photo = new Photo();
  // photo.name = 'Me and Bears';
  // photo.description = 'I am near polar bears';
  // photo.filename = 'photo-with-bears.jpg';
  // photo.views = 1;
  // photo.isPublished = true;
  // photo.user = user;
  // await photoRepository.save(photo);

  // const photo2 = new Photo();
  // photo2.name = 'Me on a fishing trip';
  // photo2.description = 'I caught a massive fish';
  // photo2.filename = 'photo-with-fish.jpg';
  // photo2.views = 5;
  // photo2.isPublished = true;
  // photo2.user = user;
  // await photoRepository.save(photo2);

  // const users = await userRepository.find()
  // console.log("Loaded users: ", users)

  // const photos = await photoRepository.find()
  // console.log("Loaded photos: ", photos)
  // setTimeout(() => {}, 999999999)
}

AppDataSource.initialize().then(main).catch(error => {
  console.log(error)
  console.log('1111111111')
})