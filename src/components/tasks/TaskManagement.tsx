import React, { useState, useEffect, useMemo } from "react";
import {Search, Shield} from "lucide-react";
import {Input, Pagination, Modal, Col, Row, DatePicker, Select} from "antd";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import {
  TaskFilteredValuesType,
  TaskResApiValuesType,
  TaskResValuesType, UserRolesType
} from "@/components/tasks/task-types/TaskTypes.ts";
import {getAllTaskByUserId, getAllTasksApi} from "@/services/task-services/TaskServices.ts";
import {CommonErrorType} from "@/components/common-types/CommonTypes.ts";
import {toast} from "react-toastify";
import useDebounce from "@/components/common-comp/useDebounce.tsx";
import {CalendarOutlined} from "@ant-design/icons";
import moment from "moment/moment";
import {SignInResType} from "@/components/common-types/AuthTypes.ts";

const { Option } = Select;

const TaskManagement: React.FC  = () => {
  const [isTableLoading, setTableLoading] = useState<boolean>(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskResValuesType>(null);
  const [allTasks, setAllTasks] = useState( []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Search state
  const [searchTaskName, setTaskName] = useState("");
  const [searchUserName, setUserName] = useState("");
  const [searchEndDate, setEndDate] = useState<moment.Moment | null>(null);
  const [searchStartDate, setStartDate] = useState<moment.Moment | null>(null);
  const [searchDescription, setDescription] = useState("");
  const [searchStatus, setSearchStatus] = useState("Select status");

  const toggleEditModal = () => setIsEditFormOpen(!isEditFormOpen);

  const savedUser = localStorage.getItem("user");
  const parsedUser:SignInResType = JSON.parse(savedUser);

  const isUserStatus:UserRolesType[] = [
    { id: "complete", name: "Complete" },
    { id: "pending", name: "Pending" }
  ];

  const [filteredValues, setFilteredValues] = useState<TaskFilteredValuesType>({
    taskName:null,
      firstName:null,
    endDate:null,
    startDate:null,
    status:null,
    description:null
  });

  const debouncedFilter = useDebounce<TaskFilteredValuesType>(filteredValues, 1000);

  useEffect(() => {
    if (debouncedFilter) changePageNoOrPageSize(filteredValues);
  }, [debouncedFilter]);

  const handleEditTask = (record: TaskResValuesType) => {
    setEditingTask(record);
    toggleEditModal();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getAllTasks = async ()=>{
    try {
      const userId = parsedUser?.user?._id ?? null;
      const response:TaskResApiValuesType = await getAllTaskByUserId(userId,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          currentPage,
          itemsPerPage
      );
      const data:TaskResValuesType[] = response.data.map((records:TaskResValuesType)=>({
        ...records,
        assignee:records?.assignUser?.firstName,
        startDate: moment(records.startDate).format("YYYY-MM-DD"),
        completeDate: moment(records.completeDate).format("YYYY-MM-DD"),
        endDate: moment(records.endDate).format("YYYY-MM-DD")
      }))
      setAllTasks(data);
    }catch (error){
      const isErrorResponse = (error: unknown): error is CommonErrorType => {
        return typeof error === 'object' && error !== null && 'response' in error;
      };
      if (isErrorResponse(error) && error.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Internal server error');
      }
    }
  }

  const changePageNoOrPageSize = async (filteredValues: TaskFilteredValuesType) => {
    try {
      const userId = parsedUser?.user?._id ?? null;
      const response:TaskResApiValuesType = await getAllTaskByUserId(userId,
          filteredValues.taskName,
          null,
          null,
          filteredValues.startDate,
          filteredValues.endDate,
          null,
          filteredValues.status,
          currentPage,
          itemsPerPage
          );
      const data:TaskResValuesType[] = response.data.map((records:TaskResValuesType)=>({
        ...records,
        assignee:records?.assignUser?.firstName,
        startDate: moment(records.startDate).format("YYYY-MM-DD"),
        completeDate: moment(records.completeDate).format("YYYY-MM-DD"),
        endDate: moment(records.endDate).format("YYYY-MM-DD")
      }))
      setAllTasks(data);
    }catch (error){
      const isErrorResponse = (error: unknown): error is CommonErrorType => {
        return typeof error === 'object' && error !== null && 'response' in error;
      };
      if (isErrorResponse(error) && error.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Internal server error');
      }
    }
  }

  return (
      <div className="container mx-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Task Management</h1>

        <div className="flex justify-between items-center mb-6">
          <Row className="w-full flex gap-1">
            <Col xs={12} md={8} lg={5} xl={3}>
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Task Name"
                  value={searchTaskName}
                  onChange={(e) => {
                    setTaskName(e.target.value)
                    setFilteredValues({
                      ...filteredValues,
                      taskName: e.target.value
                    });
                  }}
              />
            </Col>
            <Col xs={12} md={8} lg={5} xl={3}>
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <DatePicker
                  style={{ width: "100%" }}
                  value={searchStartDate}
                  suffixIcon={<CalendarOutlined />}
                  placeholder="Start Date"
                  allowClear
                  onChange={(date: moment.Moment | null) => {
                    setStartDate(date);
                    setFilteredValues({
                      ...filteredValues,
                      startDate: date ? date.format("YYYY-MM-DD") : null,
                    });
                  }}
              />
            </Col>
            <Col xs={12} md={8} lg={5} xl={3}>
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <DatePicker
                  style={{ width: "100%" }}
                  value={searchEndDate}
                  suffixIcon={<CalendarOutlined />}
                  placeholder="End Date"
                  allowClear
                  onChange={(date: moment.Moment | null) => {
                    setEndDate(date);
                    setFilteredValues({
                      ...filteredValues,
                      endDate: date ? date.format("YYYY-MM-DD") : null
                    });
                  }}
              />
            </Col>
            <Col xs={24} md={8} lg={5} xl={4}>
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Select
                  className="w-full"
                  prefix={<Shield size={18}/>}
                  placeholder="Select a status"
                  value={searchStatus}
                  allowClear
                  onChange={(value: string) => {
                    const status:string = value === undefined ? null : value === "complete" ? "complete" : "pending";
                    setSearchStatus(value);
                    setFilteredValues({
                      ...filteredValues,
                      status: status
                    });
                  }}
              >
                {isUserStatus.map((user: UserRolesType) => (
                    <Option key={user.id} value={user.id}>
                      {user.name}
                    </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        <TaskList
            tasks={allTasks}
            onEdit={handleEditTask}
            isLoading={isTableLoading}
        />

        <div className="flex justify-center mt-4">
          <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={allTasks.length}
              onChange={handlePageChange}
              showSizeChanger={false}
          />
        </div>

        {isEditFormOpen && (
            <TaskForm
                isFormOpen={isEditFormOpen}
                toggleModal={toggleEditModal}
                isEditing
                task={editingTask}
                getAllTasks={getAllTasks}
            />
        )}

      </div>
  );
};

export default TaskManagement;