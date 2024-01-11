import path from "node:path"
import { User, UserType, student, SeriesAlunos, Teacher, MateriasProf, Institution, studentsGroups, Content, Chat, RequestMentor, GameContent, Company, Coupons, ItemList, Plan, PlanTypes, CouponsUsageChart } from "../modelos/models"

//COMO A SENHA FAZ PARTE DE USUARIO ELA TALVEZ NAO SEJA NECESSARIA EM ALUNO
export const USUARIOS : User[] = [
    {
       email: "julio@gmail.com",
       codUser: "12345",
       password: "admin",
       type: UserType.ALUNO
    },
    {
        email: "maria@gmail.com",
        codUser: "67890",
        password: "123456",
        type: UserType.ALUNO
    },
    {
        email: "pedro@hotmail.com",
        codUser: "54322",
        password: "password123",
        type: UserType.ALUNO
    },
    {
        email: "ana@yahoo.com",
        codUser: "98766",
        password: "secret",
        type: UserType.ALUNO
    },
    {
       email: "b@gmail.com",
       codUser: "54321",
       password: "admin",
       type: UserType.PROFESSOR
    },
    {
       email: "a@gmail.com",
       codUser: "98765",
       password: "12345",
       type: UserType.PROFESSOR
    },
    {
        email: "ana@gmail.com",
        codUser: "98767",
        password: "admin123",
        type: UserType.PROFESSOR
      },
      {
        email: "john@gmail.com",
        codUser: "24680",
        password: "password123",
        type: UserType.PROFESSOR
      },
      {
        email: "maria@gmail.com",
        codUser: "13579",
        password: "secret",
        type: UserType.PROFESSOR
      },
      {
        email: "pedro@gmail.com",
        codUser: "86420",
        password: "prof123",
        type: UserType.PROFESSOR
      },
      {
        email: "luisa@gmail.com",
        codUser: "75319",
        password: "teacher",
        type: UserType.PROFESSOR
      },
      {
        email: "fatec@gmail.com",
        codUser: "36912",
        password: "admin",
        type: UserType.INSTITUTO
      },
      {
        email: "assynclass@gmail.com",
        codUser: "48121",
        password: "admin",
        type: UserType.EMPRESA
      }
]

export let ALUNOS: student[] = [
    {
        studentName: "Júlio César",
        studentID: 12345,
        ra: "13",
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Júlio_César&fontFamily=Arial",
        teacherID: [54321, 98765, 86420, 24680, 98767],
        studentGrade: SeriesAlunos.ANO_1,
        contact: "40028922",
        birthday: "01/01/01",
        points: 130,
        activitiesDone: [],
        inst: "36912"
    },
    {
        studentName: "Maria",
        studentID: 67890,
        ra: "23",
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Maria&fontFamily=Arial",
        teacherID: [98765],
        studentGrade: SeriesAlunos.ANO_1,
        contact: "40028922",
        birthday: "01/01/01",
        points: 0,
        activitiesDone: [],
        inst: "36912"
    },
    {
        studentName: "Pedro",
        studentID: 54322,
        ra: "33",
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Pedro&fontFamily=Arial",
        teacherID: [54321, 98765],
        studentGrade: SeriesAlunos.ANO_6,
        contact: "40028922",
        birthday: "01/01/01",
        points: 0,
        activitiesDone: [],
        inst: "36912"
    },
    {
        studentName: "Ana",
        studentID: 98766,
        ra: "43",
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Ana&fontFamily=Arial",
        teacherID: [54321],
        studentGrade: SeriesAlunos.ANO_7,
        contact: "40028922",
        birthday: "01/01/01",
        points: 0,
        activitiesDone: [],
        inst: "36912"
    }
]

export let PROFESSORES: Teacher[] = [
    {
        teacherName: "Claudio Marques",
        teacherID: 54321,
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Claudio_Marques&fontFamily=Arial",
        subjects: [MateriasProf.MATEMATICA],
        isMentor: true,
        grades: [SeriesAlunos.ANO_1],
        inst: ["36912"],
        cpf: "1234567890",
        points: 20
    },
    {
        teacherName: "Suzana Suzana",
        teacherID: 98765,
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Suzana_Suzana&fontFamily=Arial",
        subjects: [MateriasProf.PORTUGUES],
        isMentor: true,
        grades: [SeriesAlunos.ANO_1],
        inst: ["36912"],
        cpf: "1234567890",
        points: 0
    },
    {
        teacherName: "Ana Silva",
        teacherID: 98767,
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Ana_Silva&fontFamily=Arial",
        subjects: [MateriasProf.PORTUGUES],
        isMentor: false,
        grades: [SeriesAlunos.ANO_1],
        inst: ["a"],
        cpf: "1234567890",
        points: 0
    },
    {
        teacherName: "John Smith",
        teacherID: 24680,
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=John_Smith&fontFamily=Arial",
        subjects: [MateriasProf.INGLES],
        isMentor: true,
        grades: [SeriesAlunos.ANO_1],
        inst: ["36912"],
        cpf: "1234567890",
        points: 0
    },
    {
        teacherName: "Maria González",
        teacherID: 13579,
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Maria_Gonzalez&fontFamily=Arial",
        subjects: [MateriasProf.CIENCIAS],
        isMentor: false,
        grades: [SeriesAlunos.ANO_1],
        inst: ["a"],
        cpf: "1234567890",
        points: 0
    },
    {
        teacherName: "Pedro Santos",
        teacherID: 86420,
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Pedro_Santos&fontFamily=Arial",
        subjects: [MateriasProf.GEOGRAFIA],
        isMentor: true,
        grades: [SeriesAlunos.ANO_1],
        inst: ["a"],
        cpf: "1234567890",
        points: 0
    },
    {
        teacherName: "Luisa Fernandes",
        teacherID: 75319,
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=Luisa_Fernandes&fontFamily=Arial",
        subjects: [MateriasProf.HISTORIA],
        isMentor: false,
        grades: [SeriesAlunos.ANO_1],
        inst: ["a"],
        cpf: "1234567890",
        points: 0
    }
]

export let INSTITUTION: Institution[] = [
    {
        instituitionID: 36912,
        instituitionName: "Fatec",
        cnpj: "123456789",
        avatarURL: "https://api.dicebear.com/6.x/initials/svg?seed=FATEC&fontFamily=Arial",
        email: "fatec@gmail.com",
        contact: "4002-8922",
        points: 0,
        itens_list: []
    }
]

export const COMPANY: Company[] = [
    {
        cnpj: "1234567890",
        companyID: "48121",
        companyName: "Assynclass",
        coupons: [],
        plan: {
            cuponsAvailable: -1,
            endsIn: "",
            planType: PlanTypes.VOID,
            planValue: -1,
            startedIn: "",
            visibility: false
        }
    }
]

export const GRUPOS: studentsGroups[] = []

export let CONTENTS: Content[] = []

export let GAMES: GameContent[] = [
    {
        gameID: "54321_1702912728916",
        gameName: "Soma básica",
        gameDescription: "Questão de soma simples.",
        gameContent: path.resolve(__dirname, "../../public", "54321", "54321_1702912728916.asl"),
        teacherID: "54321",
        toStudent: []
    },
    {
        gameID: "54321_1702928943855",
        gameName: "Onde vivemos?",
        gameDescription: "Pergunta sobre planetas",
        gameContent: path.resolve(__dirname, "../../public", "54321", "54321_1702928943855.asl"),
        teacherID: "54321",
        toStudent: []
    },
    {
        gameID: "24680_1702989767362",
        gameName: "Animais rápidos",
        gameDescription: "Questão sobre animais.",
        gameContent: path.resolve(__dirname, "../../public", "24680", "24680_1702989767362.asl"),
        teacherID: "24680",
        toStudent: []
    },
    {
        gameID: "24680_1702993547706",
        gameName: "Corpo humano",
        gameDescription: "Pergunta sobre maior órgão do corpo humano",
        gameContent: path.resolve(__dirname, "../../public", "24680", "24680_1702993547706.asl"),
        teacherID: "24680",
        toStudent: []
    },
]

export let CHATS: Chat[] = [
{
        idChat: "0",
        firstUser: "12345",
        secondUser: "54321",
        messages: []
    }
]

export let REQUISICOES: RequestMentor[] = [
    {
        requestID: 0,
        studentID: "12345",
        teacherID: "54321"
    },
]

export let COUPONS_USAGE: CouponsUsageChart[] = []

export function removeNullables(){
    REQUISICOES = REQUISICOES.filter(r => r !== null);
}

export function addAsTeacher(studentIndex : number | undefined, idTeacher : number){
    if(studentIndex != undefined){
        if(!ALUNOS[studentIndex].teacherID.includes(idTeacher))
            ALUNOS[studentIndex].teacherID.push(idTeacher);
    }
}

export function addMessage(chatID : number | undefined, msg: string){
    if(chatID != undefined){
        CHATS[Number(chatID)].messages.push(JSON.parse(msg));
    }
}

export function sendContentTo(contentIndex: number | undefined, toStudents: number[], contentType: number){
    if(contentIndex != undefined){
        if(contentType == 0)
            CONTENTS[contentIndex].toStudent = toStudents;
        else    
            GAMES[contentIndex].toStudent = toStudents;
    }
}

export function updateStudentPoint(studentIndex: number, points: number, gameID: string){
    if(!ALUNOS[studentIndex].activitiesDone.includes(gameID)){
        ALUNOS[studentIndex].points += points;
        if(gameID != "")
            ALUNOS[studentIndex].activitiesDone.push(gameID);

        //Pontos da instituição
        let instIndex = INSTITUTION.findIndex(i => String(i.instituitionID) == ALUNOS[studentIndex].inst);

        INSTITUTION[instIndex].points = points/10;
    }
}

export function updateStudentAvatar(studentIndex: number, avatar: string){
    ALUNOS[studentIndex].avatarURL = avatar;
}

export function updateTeacherAvatar(teacherIndex: number, avatar: string){
    PROFESSORES[teacherIndex].avatarURL = avatar;
}

export function updateTeacherPoint(teacherIndex: number, points: number){
    PROFESSORES[teacherIndex].points += points;
}

export function updateInstitutionPoint(institutionIndex: number, points: number){
    INSTITUTION[institutionIndex].points += points;
}

export function removeNullablesGames(){
    GAMES = GAMES.filter(g => g !== undefined);
}

export function removeNullablesCoupons(companyIndex: number){
    COMPANY[companyIndex].coupons = COMPANY[companyIndex].coupons.filter(c => c !== undefined);
}

export function addCoupons(companyIndex: number, coupons: Coupons[], numberCoupons: number){
    COMPANY[companyIndex].coupons = COMPANY[companyIndex].coupons.concat(coupons);
    COMPANY[companyIndex].plan.cuponsAvailable -= numberCoupons;
}

export function addListToInstitution(intitutionIndex: number, itens_list: ItemList[]){
    INSTITUTION[intitutionIndex].itens_list = itens_list;
}

export function updateCompanyPlan(companyIndex: number, plan: Plan){
    COMPANY[companyIndex].plan = plan;
}

export function updateCouponUsage(companyID: string, couponID: string, userType: number){
    COUPONS_USAGE = COUPONS_USAGE.map(c => {
        if(c.companyID == companyID && c.couponID == couponID)
            return {
                companyID: c.companyID,
                couponID: c.couponID,
                couponName: c.couponName,
                numberOfCupons: c.numberOfCupons,
                usedCoupons: c.usedCoupons+1,
                usedByStudents: c.usedByStudents + ((userType == 0) ? 1 : 0),
                usedByTeachers: c.usedByTeachers + ((userType == 1) ? 1 : 0),
                usedByInstitutions: c.usedByInstitutions + ((userType == 2) ? 1 : 0),
            };
        return c;
    })
}