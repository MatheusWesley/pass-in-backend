import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./utils/generate-slug";

const app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const prisma = new PrismaClient({
  log: ['query']
});


// Definindo rotas
app.get('/', () => {
  return 'Em manutenção!!'
})

app.withTypeProvider<ZodTypeProvider>()
  .post('/events', {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      })
    }
  }, async (request, reply) => {
    // Desestruturando o data.
    const { title, details, maximumAttendees } = request.body

    const slug = generateSlug(title)

    // Verificando se ja existe um slug com o mesmo nome no banco
    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      }
    })

    if (eventWithSameSlug !== null) {
      throw new Error('Another event with same title already exists.')
    }



    const event = await prisma.event.create({
      data: {
        title,
        details,
        maximumAttendees,
        slug,
      },
    })

    return reply.status(201).send({ eventId: event.id })
  })

// Definindo a porta de execução.
app.listen({ port: 3333, host: '0.0.0.0'}).then(() => {
  console.log("Servidor HTTP rodando!!!");
  
})