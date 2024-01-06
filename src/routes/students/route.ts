import { FastifyInstance } from "fastify";
import { ALUNOS, CONTENTS, GAMES, GRUPOS, PROFESSORES, updateStudentAvatar, updateStudentPoint } from "../../db/db";
import { z } from "zod";

export async function studentsRoutes(app:FastifyInstance) {
    //ROTA PARA BUSCAR UM ALUNO EM ESPECIFICO
    app.get("/student/:id", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        })

        const {id} = paramSchema.parse(req.params);

        const aluno = ALUNOS.map(a => {
            if(id == String(a.studentID))
                return a;
        }).filter(a => a !== undefined)

        return  response.send(aluno[0]);
    })

    //ROTA PARA BUSCAR OS PONTOS DE UM ALUNO
    app.get("/student/:id/points", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        })

        const {id} = paramSchema.parse(req.params);

        const aluno = ALUNOS.map(a => {
            if(id == String(a.studentID))
                return a;
        }).filter(a => a !== undefined)

        if(aluno[0])
            return response.send(aluno[0].points);
        return response.status(404).send();
    })

    //ROTA PARA ALTERAR A PONTUAÇÃO DE UM ALUNO
    app.put("/student/:id", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        });

        const bodySchema = z.object({
            points: z.number(),
            gameID: z.string()
        })

        const {id} = paramSchema.parse(req.params);
        const {points, gameID} = bodySchema.parse(req.body);

        const aluno = ALUNOS.findIndex(a => String(a.studentID) == id);

        if(aluno == -1)
            return response.status(404).send();

        updateStudentPoint(aluno, points, gameID);

        return  response.status(200).send();
    })

    //ROTA PARA ALTERAR O AVATAR DE UM ALUNO
    app.put("/student/:id/avatar", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        });

        const bodySchema = z.object({
            avatar: z.string()
        })

        const {id} = paramSchema.parse(req.params);
        const {avatar} = bodySchema.parse(req.body);

        const aluno = ALUNOS.findIndex(a => String(a.studentID) == id);

        if(aluno == -1)
            return response.status(404).send();

        updateStudentAvatar(aluno, avatar);

        return  response.status(200).send();
    })

    //ROTA PARA BUSCAR PROFESSORES DE UM ALUNO EM ESPECIFICO
    app.get("/student/:id/teachers", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        })

        const {id} = paramSchema.parse(req.params);

        const aluno = ALUNOS.map(a => {
            if(id == String(a.studentID))
                return a;
        }).filter(a => a !== undefined)

        const professores = PROFESSORES.map(p => {
            if(aluno[0]?.teacherID.includes(p.teacherID))
                return p;
        }).filter(p => p !== undefined)

        return  response.send(professores);
    })

    //ROTA PARA BUSCAR GRUPOS EM QUE O ALUNO ESTÁ INSERIDO
    app.get("/student/:id/groups", (req, response) => {
    
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const grupos = GRUPOS.map(g => {
            if(g.studentID.includes(Number(id)))
                return g;
        }).filter(g => g !== undefined)
    
        return  response.send(grupos);
    })

    //ROTA PARA CONTEUDOS ATRIBUIDOS PARA ESTE ALUNO
    app.get("/studentContents/:id", (req, res) => {
    
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const contents = CONTENTS.map(c => {
            if(c.toStudent.includes(Number(id)))
                return c;
        }).filter(c => c !== undefined);
    
        return res.send(contents);
    })

    //ROTA PARA GAMES ATRIBUIDOS PARA ESTE ALUNO
    app.get("/studentGames/:id", (req, res) => {
    
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const games = GAMES.map(g => {
            if(g.toStudent.includes(Number(id)))
                return g;
        }).filter(g => g !== undefined);
    
        return res.send(games);
    })
}