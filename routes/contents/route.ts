import { FastifyInstance } from "fastify";
import { CONTENTS, sendContentTo } from "../../db/db";
import { z } from "zod";

export async function contentsRoutes(app:FastifyInstance) {

    //BUSCAR CONTEUDOS DO PROFESSOR
    app.get("/contents/:id", (req, res) => {
    
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const contents = CONTENTS.map(c => {
            if(c.teacherID == id)
                return c;
        }).filter(c => c !== undefined);
    
        return res.send(contents);
    })
    
    //BUSCAR CONTEUDO ESPECIFICO DE PROFESSOR 
    app.get("/contents/:id/:idContent", (req, res) => {
        
        const paramSchema = z.object({
            id: z.string(),
            idContent: z.string()
        })
    
        const {id, idContent} = paramSchema.parse(req.params);
    
        const contents = CONTENTS.map(c => {
            if(c.teacherID == id && c.contentID+"" == idContent)
                return c;
        }).filter(c => c !== undefined)[0];
    
        return res.send({contents});
    })
    
    //ADICIONAR UM CONTEUDO 
    app.post("/createContent", (req, res) => {
    
        const bodySchema = z.object({
            idTeacher: z.string(),
            content: z.string(),
            contentName: z.string(),
            contentDescription: z.string(),
        });
    
        const {idTeacher, content, contentName, contentDescription} = bodySchema.parse(req.body);
    
        CONTENTS.push({
            contentID: CONTENTS.length,
            contentName: contentName,
            contentDescription: contentDescription,
            teacherID: idTeacher,
            content: content,
            toStudent: []
        });
    
        return res.status(200).send();
    
    });
    
    //ENVIAR CONTEUDO PARA GRUPO DE ALUNOS
    app.post("/sendContent", (req, res) => {
    
        console.log(req.body)
        const bodySchema = z.object({
            idContent: z.string(),
            toStudents: z.number().array()
        });
    
        const {idContent, toStudents} = bodySchema.parse(req.body);
    
        const contentIndex = CONTENTS.map((c, index) => {
            if(c.contentID+"" == idContent)
                return index;
        }).filter(c => c !== undefined)[0];
    
        sendContentTo(contentIndex, toStudents, 0);
    
        return res.status(200).send();
    
    });
    
}
