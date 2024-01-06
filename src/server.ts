'use strict'

import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from '@fastify/cors';

import { studentsRoutes } from "./routes/students/route";
import { teachersRoutes } from "./routes/teachers/route";
import { registerRoutes } from "./routes/register/route";
import { chatRoutes, initializeChatServer } from "./routes/chat/route";
import { requestsRoutes } from "./routes/requests/route";
import { contentsRoutes } from "./routes/contents/route";
import { instituitionsRoutes } from "./routes/instituition/route";
import { gamessRoutes } from "./routes/games/route";
import multipart from '@fastify/multipart'

import path from "node:path";
import { fastifyStatic } from "@fastify/static";
import { companiesRoutes } from "./routes/companies/route";

const app = fastify();
app.register(cors, {origin: true});
app.register(jwt, {secret: 'assynclass'});

app.register(multipart)
app.register(fastifyStatic, {
    root: path.join(__dirname, 'public', 'games'),
    prefix: '/public/'
});

app.register(studentsRoutes);
app.register(teachersRoutes);
app.register(companiesRoutes);
app.register(registerRoutes);
app.register(requestsRoutes);
app.register(contentsRoutes);
app.register(gamessRoutes);
app.register(chatRoutes);
app.register(instituitionsRoutes);

initializeChatServer();
app.listen({port: 3333}).then(() => console.log("SERVER RUNNING 🔥"))

