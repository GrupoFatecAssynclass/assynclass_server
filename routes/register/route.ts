import { FastifyInstance } from "fastify";
import { ALUNOS, COMPANY, INSTITUTION, PROFESSORES, USUARIOS} from "../../db/db";
import { PlanTypes, UserType} from "../../modelos/models";
import { z } from "zod";

export async function registerRoutes(app:FastifyInstance) {

    //ROTA QUE VERIFICA OS DADOS INSERIDOS NO LOGIN 
    //E RETORNA SE AUTORIZADO E O TIPO DE CONTA (ALUNO, PROFESSOR)
    app.get("/users", (req, res) => {
        return res.send(USUARIOS);
    })

    app.post("/login", (request, response) => {

        const userSchema = z.object({
            code: z.string(),
            password: z.string()
        })

        const {code, password} = userSchema.parse(request.body);

        const user = USUARIOS.map(a => {
            if(code == String(a.codUser) || code == a.email)
                return a;
        }).filter(a => a !== undefined);

        if(user.length == 0) 
            return response.send({
                status: 401,
                token: null           
            });
        
        if(password == user[0]?.password)
            return response.send({
                status: 201,
                token: app.jwt.sign({
                    id: user[0].codUser,
                    type: user[0].type,
                    //avatar: user[0].avatarURL
                }),
            });
        return response.send({
            status: 401,
            token: null           
        });
    })

    //ROTA PARA REGISTRAR ALUNO
    app.post("/register/student", (req, res) =>{

        const students = z.object({
            nome: z.string(),
            ra: z.string(),
            nascimento: z.string(),
            serie: z.string(),
            email: z.string(),
            contato: z.string(),
            instID: z.string()
        })
    
        const {nome, ra, nascimento, serie, email, contato, instID} = students.parse(req.body);
        const id = USUARIOS.length+"";
        
        USUARIOS.push({
            email: email,
            codUser: id,
            password: ra,
            type: UserType.ALUNO
        })

        ALUNOS.push({
            studentID: Number(id),
            studentName: nome,
            ra: ra,
            birthday: nascimento,
            contact: contato,
            avatarURL: `https://api.dicebear.com/6.x/initials/svg?seed=${nome.split(" ").join("_")}&fontFamily=Arial`,
            teacherID: [],
            studentGrade: Number(serie),
            points: 0,
            activitiesDone: [],
            inst: instID
        })
    
        return res.status(200).send()
    })
    
    //ROTA PARA REGISTRAR PROFESSOR
    app.post("/register/teacher", (req, res) =>{
    
        console.log(req.body)
        const teacher = z.object({
            nome: z.string(),
            cpf: z.string(),
            email: z.string(),
            password: z.string(),
            confirmpassword: z.string(),
            materia: z.string().array(),
            serie: z.string().array(),
            instituicao: z.string().array()
        })
    
        const {nome, cpf, email, password, confirmpassword, materia, serie, instituicao} = teacher.parse(req.body);

        const id = USUARIOS.length+"";

        const subjectToNumber = materia.map(m => {
            return Number(m);
        })

        const gradeToNumber = serie.map(g => {
            return Number(g);
        })

        if(password != confirmpassword){
            return res.status(401).send()
        }
        else{
            USUARIOS.push({
                email: email,
                codUser: id,
                password: password,
                type: UserType.PROFESSOR
            })
        
            PROFESSORES.push({
                teacherID: Number(id),
                teacherName: nome,
                isMentor: false,
                cpf: cpf,
                avatarURL: `https://api.dicebear.com/6.x/initials/svg?seed=${nome.split(" ").join("_")}&fontFamily=Arial`,
                subjects: subjectToNumber,
                grades: gradeToNumber,
                inst: instituicao,
                points: 0
            })
        
        }
        return res.status(200).send()
    })
    
    //ROTA PARA REGISTRAR INSTITUIÇÃO
    app.post("/register/instituition", (req, res) =>{
    
        const institution = z.object({
            nome: z.string(),
            cnpj: z.string(),
            email: z.string(),
            password: z.string(),
            confirmpassword: z.string(),
            contato: z.string()
        })
    
        const {nome, cnpj, email, password, confirmpassword, contato} = institution.parse(req.body)
    
        if(password != confirmpassword){
            return res.status(401).send()
        }
        else{
            const id = USUARIOS.length+"";

            USUARIOS.push({
                email: email,
                codUser: id,
                password: password,
                type: UserType.INSTITUTO
            })

            INSTITUTION.push({
                instituitionID: Number(id),
                instituitionName: nome,
                cnpj: cnpj,
                email: email,
                avatarURL: `https://api.dicebear.com/6.x/initials/svg?seed=${nome.split(" ").join("_")}&fontFamily=Arial`,
                contact: contato,
                points: 0, 
                itens_list: []
            })

        }

        return res.status(200).send()
    })

    //ROTA PARA REGISTRAR EMPRESA
    app.post("/register/company", (req, res) => {

        const company = z.object({
            companyName: z.string(),
            cnpj: z.string(),
            email: z.string(),
            password: z.string(),
            confirmpassword: z.string(),
            contato: z.string()
        });

        const {companyName, cnpj, email, password, confirmpassword, contato} = company.parse(req.body);

        if(password != confirmpassword) {
            return res.status(401).send();
        }
        else{
            const id = USUARIOS.length+"";

            USUARIOS.push({
                email: email,
                codUser: id,
                password: password,
                type: UserType.EMPRESA
            })

            COMPANY.push({
                cnpj: cnpj,
                companyID: id,
                companyName: companyName,
                coupons: [],
                plan: {
                    cuponsAvailable: -1,
                    endsIn: "",
                    planType: PlanTypes.VOID,
                    planValue: -1,
                    startedIn: "",
                    visibility: false
                }
            })

        }

        return res.status(200).send()

    })
}