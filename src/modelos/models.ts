export enum UserType{
    ALUNO,
    PROFESSOR,
    INSTITUTO,
    EMPRESA
}

export enum MateriasProf{
    MATEMATICA,
    PORTUGUES,
    CIENCIAS,
    INGLES,
    GEOGRAFIA,
    HISTORIA,
    ARTES,
    EDUCACAO_FISICA,
    FILOSOFIA,
    SOCIOLOGIA,
    FISICA,
    QUIMICA,
    BIOLOGIA
}

export enum SeriesAlunos{
    ANO_6,
    ANO_7,
    ANO_8,
    ANO_9,
    ANO_1,
    ANO_2,
    ANO_3,
}

export enum PlanTypes{
    MONTHLY_NORMAL,
    YEARLY_NORMAL,
    MONTHLY_PLUS,
    YEARLY_PLUS,
    CUSTOM,
    VOID
}

export interface User{
    email: string,
    codUser: string,
    password: string,
    type: UserType
}

export interface student{
    studentName: string,
    studentID: number,
    ra: string,
    avatarURL: string,
    studentGrade: number,
    birthday: string,
    contact: string,
    points: number,
    teacherID: number[],
    inst: string,
    activitiesDone: string[]
}

export interface Teacher{
    teacherName: string,
    teacherID: number,
    avatarURL: string,
    subjects: MateriasProf[]
    grades: SeriesAlunos[],
    isMentor: boolean,
    cpf: string,
    inst: string[] | any,
    points: number
}

export interface Institution{
    instituitionID: number,
    instituitionName: string,
    avatarURL: string,
    cnpj: string,
    email: string,
    contact: string,
    points: number,
    itens_list: ItemList[]
}

export interface ItemList{
    item_id: string
    item: string
    description: string | null
}

export interface Coupons{
    couponID: string
    couponName: string
    couponDescription: string
    couponValue: number
    byCompany: string
    standOut: boolean
    endsIn: string,
    couponCode: string[]
}

export interface CouponsUsageChart{
    couponID: string
    companyID: string
    numberOfCupons: number
    usedCoupons: number
    couponName: string
    usedByStudents: number
    usedByTeachers: number
    usedByInstitutions: number
}

export interface Plan{
    cuponsAvailable: number
    planValue: number
    startedIn: string
    endsIn: string
    planType: PlanTypes,
    visibility: boolean
}

export interface Company{
    companyID: string
    companyName: string
    cnpj: string
    coupons: Coupons[]
    plan: Plan
}

export interface studentsGroups{
    teacherID: number,
    studentID: (number | undefined)[],
    groupID: number,
    groupName: string,
    groupDescription: string,
    groupAvatar: string,
}

export interface RequestMentor{
    requestID: number,
    teacherID: string,
    studentID: string
}

export interface Content{
    contentID: number,
    contentName: string,
    contentDescription: string,
    teacherID: string,
    content: string,
    toStudent: number[]
}

export interface GameContent{
    gameID: string,
    gameName: string,
    gameDescription: string,
    teacherID: string,
    gameContent: string,
    toStudent: number[]
}

export interface Chat{
    idChat: string,
    firstUser: string,
    secondUser: string,
    messages: Message[]
}

export interface Message{
    sendedBy: string,
    msg: string,
}