import * as url from './task_url_helper.ts';
import {get, put} from "@/services/ServiceMethods.ts";
import {TaskFormSubmitValuesType} from "@/components/tasks/task-types/TaskTypes.ts";

export const updateTask = (data:TaskFormSubmitValuesType) => put(`${url.CREATE_TASK}/status`, data);
export const getAllTasksApi = (taskName:string,assignUser:string,status:boolean,description:string,startDate:string,endDate:string,completeDate:string,firstName:string,limit:number,page:number) => get(`${url.CREATE_TASK}?taskName=${taskName}&assignUser=${assignUser}&description=${description}&startDate=${startDate}&endDate=${endDate}&completeDate=${completeDate}&firstName=${firstName}&limit=${limit}&page=${page}`);
export const getAllTaskByUserId = (id:string,taskName?:string,status?:string,description?:string,startDate?:string,endDate?:string,completeDate?:string,taskStatus?:string,page?:number,limit?:number)=>get(`${url.CREATE_TASK}/user?userId=${id}&taskName=${taskName}&status=${status}&description=${description}&startDate=${startDate}&endDate=${endDate}&completeDate=${completeDate}&taskStatus=${taskStatus}&page=${page}&limit=${limit}`);