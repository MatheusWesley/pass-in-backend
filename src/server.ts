import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-handler";

const app = fastify();

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass-in',
      description: 'Documentação da API pass-in para facilitar a integração com o backend',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})


app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);



// Definindo rotas
app.get('/', () => {
  return 'Em manutenção!!'
})

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)


app.setErrorHandler(errorHandler)




// Definindo a porta de execução, colocar o host como 0.0.0.0
// me permite acessar as rotas de outros dispositivos com o ip da rede local
app.listen({ port: 3333, host: '0.0.0.0'}).then(() => {
  console.log("Servidor HTTP rodando!!!");
  
})