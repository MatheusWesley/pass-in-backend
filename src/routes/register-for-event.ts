import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";


export async function RegisterForEvent (app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>()
  /* 
    Quero criar/registrar um participante (attendees)
    dentro de um evento (events)
    identificado pelo id do evento (eventId)
  */
  .post('/events/:eventId/attendees', {
    schema: {
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
      }),
      params: z.object({
        eventId: z.string().uuid(),
      }),
      response:{
        201: z.object({
          attendeeId: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params
    const { name, email} = request.body

    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      },
    })
    return reply.status(201).send({ attendeeId: attendee.id })
  })
}