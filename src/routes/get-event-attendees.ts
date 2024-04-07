import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .get('/events/:eventId/attendees', {
    schema: {
      summary:'List events from attendee',
      tags: ['Events'],
      params: z.object({
        eventId: z.string().uuid(),
      }),
      querystring:z.object({
        query: z.string().nullish(), //nullish significa que pode null ou undefined
        pageIndex: z.string().nullish().default('0').transform(Number)
      }),
      response: {
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number().int(),
              name: z.string(),
              email: z.string().email(),
              createAt: z.date(),
              checkInAt: z.date().nullable()
            })
          )
        })
      },
    }
  }, async (request, reply) => {

    const { eventId } = request.params
    const { pageIndex, query } = request.query

    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createAt: true,
        checkIn: {
          select: {
            createAt: true
          }
        }
      },
      where: query ? {
        eventId,
        name: {
          contains: query,
        }
      } : {
        eventId,
      },
      take: 10,
      skip: pageIndex * 10,
      orderBy: {
        createAt: 'desc'
      }
    })
    return reply.send({
      attendees: attendees.map(attendee => {
        return {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          createAt: attendee.createAt,
          checkInAt: attendee.checkIn?.createAt ?? null
        }
      })
    })
  })
}