import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ALUNOS, COMPANY, INSTITUTION, PROFESSORES, addCoupons, removeNullables, removeNullablesCoupons, updateCompanyPlan, updateInstitutionPoint, updateStudentPoint, updateTeacherPoint } from "../../db/db";
import { Coupons, Plan, PlanTypes } from "../../modelos/models";

export async function companiesRoutes(app: FastifyInstance){

    //ROTA PARA BUSCAR UMA EMPRESA EM ESPECIFICO
    app.get("/company/:id", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        })

        const {id} = paramSchema.parse(req.params);

        const company = COMPANY.map(a => {
            if(id == String(a.companyID))
                return a;
        }).filter(a => a !== undefined)

        return  response.send(company[0]);
    })

    //ROTA PARA BUSCAR CUPONS DE UMA EMPRESA EM ESPECIFICO
    app.get("/company/:id/coupons", (req, response) => {
        
        const paramSchema = z.object({
            id: z.string()
        })

        const {id} = paramSchema.parse(req.params);

        const company = COMPANY.map(a => {
            if(id == String(a.companyID))
                return a;
        }).filter(a => a !== undefined)

        if(company[0])
            return  response.send(company[0].coupons);
        return response.status(401).send();
    })

    //ATUALIZA CUPONS
    app.post("/use_coupon", (req, res) => {
        const bodySchema = z.object({
            id: z.string(),
            coupon_id: z.string(),
            user_id: z.string(),
            user_type: z.number()
        });

        const {id, coupon_id, user_id, user_type} = bodySchema.parse(req.body);

        const company = COMPANY.find(c => c.companyID == id);

        let coupon_code;
        let coupon_group : Coupons | undefined;
        if(company){
            coupon_group = company.coupons.find(c => c.couponID == coupon_id);

            if(coupon_group)
                coupon_code = coupon_group.couponCode[coupon_group.couponCode.length-1];
            else
                return res.status(404).send();
        }
        else
            return res.status(404).send();


        if(user_type == 0){
            const aluno = ALUNOS.find(s => s.studentID+"" == user_id);

            if(aluno){
                if(aluno.points > coupon_group.couponValue)
                    updateStudentPoint(ALUNOS.findIndex(s => s == aluno), -coupon_group.couponValue, "");
                else{
                    return res.send({status: 401});
                }
            }
        }
        else if(user_type == 1){
            const professor = PROFESSORES.find(t => t.teacherID+"" == user_id);

            if(professor){
                if(professor.points > coupon_group.couponValue)
                    updateTeacherPoint(PROFESSORES.findIndex(t => t == professor), -coupon_group.couponValue);
                else{
                    return res.send({status: 401});
                }
            }
        }
        else if(user_type == 2){
            const institution = INSTITUTION.find(i => i.instituitionID+"" == user_id);

            if(institution){
                if(institution.points > coupon_group.couponValue)
                    updateInstitutionPoint(INSTITUTION.findIndex(i => i == institution), -coupon_group.couponValue);
                else{
                    return res.send({status: 401});
                }
            }
        }
        
        coupon_group.couponCode.pop();
        if(coupon_group.couponCode.length == 0){
            delete company.coupons[company.coupons.findIndex(c => c == coupon_group)]
            removeNullablesCoupons(COMPANY.findIndex(c => c == company));
        }
        return res.send({code: coupon_code})
    });

    //ROTA PARA POSTAR CUPONS
    app.post("/coupons", (req, res) => {
        const bodySchema = z.object({
            title: z.string(),
            description: z.string(),
            value: z.number(),
            days: z.number(),
            codes: z.string(),
            companyID: z.string()
        });

        const {companyID, title, description, value, days, codes} = bodySchema.parse(req.body);

        const companyIndex = COMPANY.findIndex(c => c.companyID == companyID);

        let coupons : Coupons[] = [];

        const d1 = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);
        const diffInMs = Number(new Date(d1.getTime() + days * 24 * 60 * 60 * 1000)) - Number(d1);
        const resultDate = new Date(d1.getTime() + diffInMs);

        let code_coupons : string[] = codes.split(",").map(c => c.trim());

        if(COMPANY[companyIndex].plan.planType != PlanTypes.VOID){

            if(COMPANY[companyIndex].plan.cuponsAvailable - code_coupons.length >= 0){
                coupons.push(
                    {
                        byCompany: companyID,
                        couponDescription: description,
                        couponName: title,
                        couponValue: value,
                        standOut: false,
                        endsIn: resultDate.toLocaleDateString(),
                        couponID: String(COMPANY[companyIndex].coupons.length),
                        couponCode: code_coupons
                    }
                );
    
                addCoupons(companyIndex, coupons, code_coupons.length);
                return res.status(200).send();
            }
        }
        return res.status(401).send();
        
    });

    //ROTA PARA BUSCAR CUPONS
    app.get("/coupons", (_req, res) => {

        let coupons : Coupons[] = [];

        COMPANY.map(c => {
            if(c){
                if(c.plan.visibility)
                    coupons = c.coupons.concat(coupons);
                else 
                    coupons = coupons.concat(c.coupons);
            }
        });

        return res.send(coupons);
    });

    //ROTA QUE ATUALIZA O PLANO DE UMA EMPRESA (CUSTOM FOI DESCONSIDERADO)
    app.put("/company/:companyID/plan", (req, res) => {

        const paramSchema = z.object(
            {
                companyID: z.string()
            }
        )

        const bodySchema = z.object(
            {
                planType: z.number()
            }
        )

        const {companyID} = paramSchema.parse(req.params);
        const {planType} = bodySchema.parse(req.body);

        const NumberOfCoupons : number[] = [50, 600, 100, 1200];
        const PlansValues : number[] = [30, 360, 60, 720];

        const days : number[] = [30, 365, 30, 365]; 
        const visibility : boolean[] = [false, false, true, true]; 

        const d1 = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);
        const diffInMs = Number(new Date(d1.getTime() + days[planType] * 24 * 60 * 60 * 1000)) - Number(d1);
        const resultDate = new Date(d1.getTime() + diffInMs);

        const plan : Plan = {
            cuponsAvailable: NumberOfCoupons[planType],
            startedIn: d1.toLocaleDateString(),
            endsIn: resultDate.toLocaleDateString(),
            planValue: PlansValues[planType],
            planType,
            visibility: visibility[planType]
        }

        const companyIndex = COMPANY.findIndex(i => i.companyID == companyID);

        if(companyIndex != -1){
            updateCompanyPlan(companyIndex, plan);
            return res.status(200).send();
        }

        return res.status(401).send();
    });

    //ROTA QUE ATUALIZA O PLANO DE UMA EMPRESA (CUSTOM FOI DESCONSIDERADO)
    app.put("/company/:companyID/custom_plan", (req, res) => {

        const paramSchema = z.object(
            {
                companyID: z.string()
            }
        )

        const bodySchema = z.object(
            {
                cuponsAvailable: z.number(),
                days: z.number(),
                planValue: z.number(),
                visibility: z.boolean()
            }
        )

        const {companyID} = paramSchema.parse(req.params);
        const {cuponsAvailable, days, planValue, visibility} = bodySchema.parse(req.body);

        const d1 = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);
        const diffInMs = Number(new Date(d1.getTime() + days * 24 * 60 * 60 * 1000)) - Number(d1);
        const resultDate = new Date(d1.getTime() + diffInMs);

        const plan : Plan = {
            cuponsAvailable,
            startedIn: d1.toLocaleDateString(),
            endsIn: resultDate.toLocaleDateString(),
            planValue,
            planType: 4,
            visibility
        }

        const companyIndex = COMPANY.findIndex(i => i.companyID == companyID);

        if(companyIndex != -1){
            updateCompanyPlan(companyIndex, plan);
            return res.status(200).send();
        }

        return res.status(401).send();
    });

}