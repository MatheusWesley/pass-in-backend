import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";


export async function registerForEvent (app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>()
  /* 
    Quero criar/registrar um participante (attendees)
    dentro de um evento (events)
    identificado pelo id do evento (eventId)
  */
  .post('/events/:eventId/attendees', {
    schema: {
      summary:'Register an attendee from event',
      tags: ['Attendee'],
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

    //Fazendo a verificação se o email ja está registrado no evento
    const attendeeFromEmail = await prisma.attendee.findUnique({
      where: {
        eventId_email: {
          email,
          eventId
        }
      }
    })
  
    if (attendeeFromEmail !== null) {
      throw new BadRequest('Email registered has already event');
    }

    // Verificando se o total de participantes ja foi atingido
    const [ event, totalAttendeesFromEvent ] = await Promise.all([
      prisma.event.findUnique({
        where: {
          id: eventId
        }
      }),
      prisma.attendee.count({
        where: {
          eventId,
        }
      })
    ])

    if (event?.maximumAttendees && totalAttendeesFromEvent >= event?.maximumAttendees) {
      throw new BadRequest("Maximum attendees reached for this event.")
    }



    // Criação do participante no banco.
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