import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .get('/attendees/:attendeeId/badge', {
    schema: {
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {

      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params

    const attendee = await prisma.attendee.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          select: {
            title: true,
          }
        }
      },
      where: {
        id: attendeeId,
      }
    })

    if (attendee === null) {
      throw new Error ('Attendee not found.');
    }

    // Nas linhas abaixo estou basicamente gerando um link
    //para ser gerado o QR code no frontend que irá direcionar
    //para a area de check-in do evento
    const baseURL = `${request.protocol}://${request.hostname}`
    const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

    return reply.send({
      badge: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInURL: checkInURL.toString()
      }
    })
  })
}