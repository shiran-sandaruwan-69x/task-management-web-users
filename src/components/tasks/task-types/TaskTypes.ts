export type TaskFormValuesType ={
    taskId?:string;
    completeDate?:any;
    taskStatus?:boolean;
};

export type TaskFormSubmitValuesType ={
    taskId?:string;
    completeDate?:string;
    taskStatus?:string;
};

export type TaskResType ={
    taskName:string;
    description?:string;
    startDate?:string;
    endDate?:string;
    assignUser?:string;
    assignee?:string;
    status?:boolean;
    _id: string,
};

export type TaskFilteredValuesType ={
    taskName:string;
    firstName:string;
    description?:string;
    startDate?:string;
    endDate?:string;
    status?:string;
};

export type DropDownValuesType ={
    _id?:string;
    firstName?:string;
    lastName?:string;
    endDate?:string;
    email?:boolean;
};

export type DropDownValuesApiType ={
    data?:DropDownValuesType[];
};

export type TaskResValuesType ={
    _id?:string;
    taskName?:string;
    description?:string;
    startDate?:string;
    endDate?:string;
    assignUser?:{
        _id?:string;
        firstName?:string;
        lastName?:string;
    };
    status?:boolean;
    taskStatus?:string;
    completeDate?:string;
    assignee?:string;
};

export type TaskResApiValuesType ={
    data?:TaskResValuesType[];
};

export type UserRolesType={
    id:string;
    name:string;
};