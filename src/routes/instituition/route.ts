import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ALUNOS, CONTENTS, GAMES, INSTITUTION, PROFESSORES, addListToInstitution } from "../../db/db";
import { GameContent, student } from "../../modelos/models";

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

    app.get("/instituition/:id/teachers_charts", (req, res) => {

        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);

        const data : any = [];

        let teachers = PROFESSORES.filter(t => t.inst.includes(id));
        teachers.forEach(t => {

            let status = {
                teacherID: t.teacherID,
                teacherName: t.teacherName,
                NumberOfContents: 0
            }

            let teacher_games = GAMES.filter(g => g.teacherID == (t.teacherID+"")).length;
            let teacher_contents = CONTENTS.filter(c => c.teacherID == (t.teacherID+"")).length;

            status.NumberOfContents = teacher_games + teacher_contents;

            data.push(status);
        })

        return res.send(data);
    });

    app.get("/instituition/:id/groups_teachers", (req, res) => {
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
        let teachers = PROFESSORES.filter(t => t.inst.includes(id));

        let data : any = [] 

        teachers.forEach(t => {
            const assigned : GameContent[] = GAMES.filter(g => g.teacherID == (t.teacherID+""));
            let total_done = 0, total_expected = 0, percentage = 0;

            assigned.forEach(g => {
                
                total_expected += g.toStudent.length;
    
                let teacher_students : student[] = ALUNOS.filter(s => s.teacherID.includes(Number(t.teacherID)) && g.toStudent.includes(s.studentID));
                
                teacher_students.forEach(s => {
                    if(s.activitiesDone.includes(g.gameID))
                        total_done += 1;
                });

            });

            percentage = (total_done*100)/total_expected;

            data.push(
                {
                    teacherName: t.teacherName,
                    teacherID: t.teacherID,
                    percentage: (total_expected == 0) ? 0 : percentage
                }
            )
        })

        return res.send(data);
    });

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