import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ALUNOS, INSTITUTION, PROFESSORES, addListToInstitution } from "../../db/db";

export async function instituitionsRoutes(app: FastifyInstance) {

    //ROTA PARA BUSCAR INFORMAÇÕES ESPECIFICAS DE INSTITUIÇÃO
    app.get("/instituition/:id", (req, res) => {
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const instituition = INSTITUTION.map(i => {
            if(id == String(i.instituitionID))
                return i;
        }).filter(i => i !== undefined)[0];
    
        return res.send(instituition);
    })

    //ROTA PARA BUSCAR PONTOS DE UMA INSTITUIÇÃO
    app.get("/instituition/:id/points", (req, res) => {
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const instituition = INSTITUTION.map(i => {
            if(id == String(i.instituitionID))
                return i;
        }).filter(i => i !== undefined)[0];
    
        if(instituition)
            return res.send(instituition.points);
        return res.status(404).send();
    })

    //ROTA PARA BUSCAR PROFESSORES DE UMA INSTITUIÇÃO
    app.get("/instituition/:id/teachers", (req, res) => {
        const paramSchema = z.object({
            id: z.string()
        })

        const {id} = paramSchema.parse(req.params);

        const professores = PROFESSORES.map(t => {
            if(t.inst.includes(id+""))
                return t;
        }).filter(t => t !== undefined);

        return res.send(professores);
    });

    //ROTA PARA BUSCAR PROFESSORES DE UMA INSTITUIÇÃO POR MATÉRIA
    app.get("/instituition/:id/teachers/:subject", (req, res) => {
        const paramSchema = z.object({
            id: z.string(),
            subject: z.string()
        })

        const {id, subject} = paramSchema.parse(req.params);

        const professores = PROFESSORES.map(t => {
            if(t.inst.includes(id+"") && t.subjects.includes(Number(subject)))
                return t;
        }).filter(t => t !== undefined);

        return res.send(professores);
    });

    //ROTA PARA BUSCAR ALUNOS DE UMA INSTITUIÇÃO
    app.get("/instituition/:id/students", (req, res) => {
        const paramSchema = z.object({
            id: z.string()
        })

        const {id} = paramSchema.parse(req.params);

        const alunos = ALUNOS.map(s => {
            if(s.inst == id)
                return s;
        }).filter(s => s !== undefined);

        return res.send(alunos);
    });

    app.post("/instituition/list", (req, res) => {
        
        const bodySchema = z.object({
            institutionID: z.string(),
            itens_list: z.array(z.object({
                item_id: z.string(),
                item: z.string(),
                description: z.string()
            }))
        });

        const {institutionID, itens_list} = bodySchema.parse(req.body);

        const institutionIndex = INSTITUTION.findIndex(i => String(i.instituitionID) == institutionID);

        if(institutionIndex != -1){
            addListToInstitution(institutionIndex, itens_list);
            return res.status(200).send();
        }

        return res.status(401).send();
    });

    app.get("/institution/:id/list", (req, res) => {

        const paramsSchema = z.object({
            id: z.string()
        })

        const {id} = paramsSchema.parse(req.params);

        let institution = INSTITUTION.find(i => String(i.instituitionID) == id);

        if(institution)
            return res.send(institution.itens_list);
        
        return res.status(401).send();

    });

    app.get("/to_donate", (_req, res) => {

        let institutions = INSTITUTION.filter(i => i.itens_list.length > 0).map(i => ({name: i.instituitionName, id: i.instituitionID, itens_list: i.itens_list}));

        return res.send(institutions);
    })
}