import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify();
const prisma = new PrismaClient({
  log: ['query']
});


// Definindo rotas
app.get('/', () => {
  return 'Pagina inicial'
})

app.post('/events', async (request, reply) => {

  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable()
  })

  const data = createEventSchema.parse(request.body)

  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: new Date().toISOString()
    },
  })
   
  return reply.status(201).send({eventId: event.id})
})

// Definindo a porta de execução.
app.listen({ port: 3333, host: '0.0.0.0'}).then(() => {
  console.log("Servidor HTTP rodando!!!");
  
})