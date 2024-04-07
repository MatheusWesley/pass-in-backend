import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: '4d13432b-5e41-418e-9999-c5c11134d41f',
      title: 'NLW Unite',
      slug: 'nlw-unite',
      details: 'Um evento para quem ama codar',
      maximumAttendees: 120
    }
  })
}


seed().then(() => {
  console.log("Banco de dados populado.");
  prisma.$disconnect()  
})