import { faker } from '@faker-js/faker'
import { exec } from 'child_process';
import fs from 'fs'

const users = []
for (let i = 0; i < 100; i++) {
  const userF = {
    lastname: faker.person.lastName(),
    firstname: faker.person.firstName()
  }
  const user = {
    phone: faker.phone.number().replaceAll(/-/gi, ''),
    lastname: userF.firstname,
    firstname: userF.lastname,
    dialcode: faker.location.countryCode('numeric'),
    allowedjobapplication: 66,
    allowedjobposting: 55,
    isactive: true,
    createdat: faker.date.recent(),
    updatedat: faker.date.recent(),
    otp: '$2a$10$awGdtZcdKt2R6IiitpUTHuGCxkH3hAPIgamp7fKN5jaMhgrmKeDL2',
    firebasetokens: [
      'fwdxvAgATKGrL4l4EVKj9k:APA91bEFVFdp_YvV2QGCxS0P-a-CIYXVdTmGnSBvIeg4XjAdatB6_hI_cWT9WFYy46aABS7JhZICVxPbePKN2S4cexRtwkJSY9vsu6_vRUO-I9tjPBcg6xQ7VHAQ0w-16ct8MUDWoSPE'
    ],
    aboutme: faker.person.bio(),
    activeforjobs: false,
    location: {
      pincode: faker.location.zipCode(),
      city: faker.location.city(),
      district: faker.string.alpha(20),
      state: 'Maharashtra',
      coordinates: [faker.location.longitude(), faker.location.latitude()],
      type: 'Point'
    },
    tags: ["ObjectId('666c98d872f3c11fb24fbfe6')"],
    email: userF.firstname + userF.lastname + '@gmail.com',
    fakerUser: true
  }
  users.push(JSON.stringify(user,null,4))
}

// fs.writeFileSync('gg.json',  `[${users}]`, 'utf-8')

exec(`echo ${JSON.stringify(users)} > datta.json`)
// console.log(JSON.stringify(users))
