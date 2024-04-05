import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { RegisterForEvent } from "./routes/register-for-event";

const app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);



// Definindo rotas
app.get('/', () => {
  return 'Em manutenção!!'
})

app.register(createEvent)
app.register(RegisterForEvent)






// Definindo a porta de execução.
app.listen({ port: 3333, host: '0.0.0.0'}).then(() => {
  console.log("Servidor HTTP rodando!!!");
  
})