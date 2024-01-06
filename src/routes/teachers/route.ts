import { FastifyInstance } from "fastify";
import { ALUNOS, GAMES, GRUPOS, INSTITUTION, PROFESSORES, updateTeacherPoint } from "../../db/db";
import { z } from "zod";

export async function teachersRoutes(app:FastifyInstance) {

    //ROTA PARA INFORMAÇÔES DE UM PROFESSOR ESPECIFICO
    app.get("/teachers", (_req, response) => {
        return response.send(PROFESSORES);
    })

    //ROTA PARA BUSCAR TODOS OS PROFESSORES POR MATERIA
    app.get("/teachers/:materia", (req, res) => {
    
        const paramSchema = z.object({
            materia: z.string()
        })
    
        const {materia} = paramSchema.parse(req.params);
    
        const professores = PROFESSORES.map(p => {
            if(p.subjects.includes(Number(materia)))
                return p;
        }).filter(p => p !== undefined);
    
        return res.send(professores)
    
    })

    //ROTA PARA ALTERAR A PONTUAÇÃO DE UM ALUNO
    app.put("/teacher/:id", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        });

        const bodySchema = z.object({
            points: z.number()
        })

        const {id} = paramSchema.parse(req.params);
        const {points} = bodySchema.parse(req.body);

        const professor = PROFESSORES.findIndex(p => String(p.teacherID) == id);

        if(professor == -1)
            return response.status(404).send();

        updateTeacherPoint(professor, points);

        return  response.status(200).send();
    })

    //ROTA PARA INFORMAÇÔES DE UM PROFESSOR ESPECIFICO
    app.get("/teacher/:id", (req, response) => {
    
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const prof = PROFESSORES.map(a => {
            if(id == String(a.teacherID))
                return a;
        }).filter(a => a !== undefined)[0];

        if(prof != undefined){
            const instituitionName = prof.inst.map((idi : string) => {
                return (INSTITUTION.map(i => {
                    if(i.instituitionID+"" == idi)
                        return i.instituitionName;
                }).filter(i => i !== undefined)[0])
            });
        
            return response.send({
                teacherName: prof.teacherName,
                teacherID: prof.teacherID,
                avatarURL: prof.avatarURL,
                subjects: prof.subjects,
                grades: prof.grades,
                isMentor: prof.isMentor,
                cpf: prof.cpf,
                inst: instituitionName,
                points: prof.points
            });
        }
        return response.send(prof);
    })

    //ROTA PARA BUSCAR PONTOS DE UM PROFESSOR ESPECIFICO
    app.get("/teacher/:id/points", (req, response) => {
    
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const prof = PROFESSORES.map(a => {
            if(id == String(a.teacherID))
                return a;
        }).filter(a => a !== undefined)[0];

        if(prof){
            return response.send(prof.points);
        }
        return response.status(404).send();
    })
    
    //ROTAS PARA BUSCAR AlUNOS DO PROFESSOR ESPECIFICADO
    app.get("/teacher/:id/students", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const alunos = ALUNOS.map(a => {
            if(a.teacherID.includes(Number(id)))
                return a;
        }).filter(a => a !== undefined)
    
        return  response.send(alunos);
    })
    
    //ROTA PARA BUSCAR GRUPOS DESTE PROFESSOR
    app.get("/teacher/:id/groups", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        })
    
        const {id} = paramSchema.parse(req.params);
    
        const grupos = GRUPOS.map(g => {
            if(g.teacherID == Number(id))
                return g;
        }).filter(g => g !== undefined)
    
        return  response.send(grupos);
    })
    
    //ROTA PARA BUSCAR PROFESSORES QUE SÃO MENTORES
    app.get("/teachers/mentors", (req, res) => {
    
        const mentores = PROFESSORES.map(p => {
            if(p.isMentor)
                return p;
        }).filter(p => p !== undefined);
    
        return res.send(mentores)
    
    })
    
    //ROTA PARA BUSCAR MENTORES POR MATERIA
    app.get("/teachers/mentors/:materia", (req, res) => {
    
        const paramSchema = z.object({
            materia: z.string()
        })
    
        const {materia} = paramSchema.parse(req.params);
    
        const mentores = PROFESSORES.map(p => {
            if(p.isMentor && p.subjects.includes(Number(materia)))
                return p;
        }).filter(p => p !== undefined);
    
        return res.send(mentores)
    
    })

    //ROTA PARA A CRIAÇÃO DE UM GRUPO
    app.post("/teacher/createGroup", (req, response) => {
    
        const bodySchema = z.object({
            groupName: z.string(),
            description: z.string(),
            integrantes: z.string(),
            teacherID: z.string()
        })
    
        const {groupName, description, integrantes, teacherID} = bodySchema.parse(req.body);
    
        const idAlunos = integrantes.toLowerCase().split(",").map(s => {return s.trim()});
    
        const alunos = ALUNOS.map(a => {
            if(idAlunos.includes(a.studentID+"") || idAlunos.includes(a.studentName.toLowerCase())){
                return a.studentID;
            }
        }).filter(a => a !== undefined);
    
        GRUPOS.push(
            {
                groupID: GRUPOS.length,
                teacherID: Number(teacherID),
                groupName: groupName,
                groupDescription: description,
                studentID: alunos,
                groupAvatar: `https://api.dicebear.com/6.x/initials/svg?seed=${groupName.split(" ").join("_")}&fontFamily=Arial`
            }
        )
    
        return response.status(200).send();
    })

    //ROTA PARA BUSCAR OS JOGOS DESSE PROFESSOR
    app.get("/teacher/:id/games", (req, res) => {
        const paramsSchema = z.object({
            id: z.string()
        })

        const {id} = paramsSchema.parse(req.params);

        const teacherID = id.split("_")[0];

        const teacherGames = GAMES.map(g => {
            if(g.teacherID == teacherID)
                return g;
        }).filter(g => g !== undefined);

        // const teacher_folder = path.resolve(__dirname, "../../public", teacherID);

        // if(!fs.existsSync(teacher_folder)){
        //     return res.send([]);
        // }

        // const fileList = fs.readdirSync(teacher_folder).map(f => f.split(".")[0]);

        return res.send(teacherGames);
    })
}