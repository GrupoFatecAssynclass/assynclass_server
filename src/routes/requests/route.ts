import { FastifyInstance } from "fastify";
import { ALUNOS, REQUISICOES, addAsTeacher, removeNullables } from "../../db/db";
import { z } from "zod";

export async function requestsRoutes(app:FastifyInstance) {

    //BUSCA TODAS AS REQUISIÇÕES
    app.get("/requests", (r, response) => {
        return response.send(REQUISICOES);
    })
    
    //BUSCAR REQUISIÇÃO ESPECIFICA
    app.get("/requests/:id", (req, res) => {
        
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const requisitions = REQUISICOES.map(r => {
            if(r.teacherID == id){
                const aluno = ALUNOS.map(a => {
                    if(r.studentID == String(a.studentID))
                        return a;
                }).filter(a => a !== undefined)[0]
                
                return {
                    requisition: r,
                    student: aluno
                };
            }
        }).filter(r => r !== undefined);
    
        return res.send(requisitions);
    })

    //ENVIAR REQUISIÇÃO PARA PROFESSOR
    app.post("/sendRequest", (req, res) => {

        const bodySchema = z.object({
            teacherID: z.string(),
            studentID: z.string()
        })
    
        const {teacherID, studentID} = bodySchema.parse(req.body);
    
        REQUISICOES.push(
            {
                requestID: REQUISICOES.length,
                teacherID: teacherID,
                studentID: studentID
            }
        )
    
        return res.status(200).send();
    
    })
    
    //REMOVER REQUISIÇÃO
    app.delete("/removeRequest", (req, res) => {
    
        const bodySchema = z.object({
            teacherID: z.string(),
            studentID: z.string()
        })
    
        const {teacherID, studentID} = bodySchema.parse(req.body);
    
        const filtered = REQUISICOES.map(r => {
            if(r.studentID == studentID && r.teacherID == teacherID){
                return r.requestID;
            }
        }).filter(r => r !== undefined)[0];
    
    
        if(filtered != undefined){
            delete REQUISICOES[filtered];
            removeNullables();
        }
    
        return res.status(200).send();
    })
    
    //ACEITAR REQUISIÇÃO DO ALUNO
    app.post("/acceptStudent", (req, res) => {
    
        const bodySchema = z.object({
            idStudent: z.string(),
            idTeacher: z.string(),
            idRequest: z.number(),
            accept: z.coerce.boolean(),
        })
        
        const {idStudent, idTeacher, idRequest, accept} = bodySchema.parse(req.body);
        
        if(accept){
            const aluno = ALUNOS.map((a, index) => {
                if(a.studentID+"" == idStudent)
                return index;
            }).filter(a => a !== undefined)[0];
            
            addAsTeacher(aluno, Number(idTeacher));
        }
    
        //INDEPENDETE DA RESPOSTA, A REQUISIÇÃO DEVERÁ SER REMOVIDA DA LISTA
        const filtered = REQUISICOES.map(r => {
            if(r.requestID == idRequest){
                return r.requestID;
            }
        }).filter(r => r !== undefined)[0];
    
    
        if(filtered != undefined){
            delete REQUISICOES[filtered];
            removeNullables();
        }
        
    
        return res.status(200).send();
    });
}