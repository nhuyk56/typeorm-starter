# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command


case all
  + func gom last items
  + call function
cmd process group, download chapter files
  + -fnp=path/to/fn.json
  + after done, i have files with name is (Md5 Id)
  + generate json total group
cmd upload git
  + call upload git function
  + after upload git >> generate files _general_/git/Md5Id.git.txt (chapter)
cmd sync manifest
  + update manifest json
  + update manifest git >> generate files _general_/git/Md5Id.git.txt (story)
  + update story db
----------------------------------------------------------
npm run story:main target=tangthuvien
npm run manifest:main target=tangthuvien force
npm run chapter:main gfn=1657884429324-50.json
npm run chapter:git:main gfn=1657884429324-501111.json gitSSH=git@github.com----nhuyk56:nhuyk56/SyncStorage1.git
npm run manifest:git:main gitSSH=git@github.com----nhuyk56:nhuyk56/SyncStorage1.git