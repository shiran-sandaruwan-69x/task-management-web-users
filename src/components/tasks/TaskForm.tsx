import React, {useEffect, useState} from "react";
import {Form, Input, Select, Button, Switch, Row, Col, DatePicker, Modal} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import {
    TaskFormSubmitValuesType,
    TaskFormValuesType,
    TaskResValuesType
} from "@/components/tasks/task-types/TaskTypes.ts";
import {toast} from "react-toastify";
import {CommonErrorType} from "@/components/common-types/CommonTypes.ts";
import {updateTask} from "@/services/task-services/TaskServices.ts";
const { TextArea } = Input;

interface TaskFormProps {
    isFormOpen:boolean;
    toggleModal:()=>void;
    isEditing?: boolean;
    task:TaskResValuesType;
    getAllTasks:()=>void;
}
const TaskForm: React.FC<TaskFormProps> = ({
                                               isFormOpen,
                                               toggleModal,
                                               isEditing,
                                               task,
                                               getAllTasks
                                           }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (task) {
            form.setFieldsValue({
                ...task,
                taskStatus:task.taskStatus === "complete",
                assignUser:task?.assignUser?._id ? task?.assignUser?._id : '',
                completeDate: task?.completeDate ? moment(task?.completeDate, "YYYY-MM-DD") : null,
                startDate: task?.startDate ? moment(task?.startDate, "YYYY-MM-DD") : null,
                endDate: task?.endDate ? moment(task?.endDate, "YYYY-MM-DD") : null,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: true,
            });
        }
    }, [task, form]);

    // update task
    const handleSubmit = async (values: TaskFormValuesType) => {
        const formattedValues: TaskFormSubmitValuesType = {
            taskId: task?._id ?? null,
            taskStatus: values.taskStatus === true ? 'complete' : 'pending',
            completeDate: values.completeDate ? moment(values.completeDate.toDate()).format("YYYY-MM-DD") : null
        };
        if (task?._id) {
            try {
                setIsLoading(true);
                await updateTask(formattedValues);
                getAllTasks();
                toast.success('Updated successfully!');
                form.resetFields();
                toggleModal();
            }catch (error){
                const isErrorResponse = (error: unknown): error is CommonErrorType => {
                    return typeof error === 'object' && error !== null && 'response' in error;
                };
                if (isErrorResponse(error) && error.response) {
                    toast.error(error?.response?.data?.message);
                } else {
                    toast.error('Internal server error');
                }
            }finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Modal
            title={isEditing ? "View Task" : "Create New Task"}
            style={{ top: 20 }}
            open={isFormOpen}
            onCancel={() => toggleModal()}
            footer={null}
            width={800}
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical" className="w-full mx-auto">
                <Row>
                    <Col xs={24}>
                        <Form.Item
                            label="Task Name"
                            name="taskName"
                            rules={[]}
                        >
                            <Input disabled
                                placeholder="Enter task name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[]}
                        >
                            <TextArea disabled rows={4} placeholder="Enter description of the task" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[10, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Start Date"
                            name="startDate"
                            rules={[]}
                        >
                            <DatePicker
                                disabled
                                style={{ width: "100%" }}
                                suffixIcon={<CalendarOutlined />}
                                // disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="End Date"
                            name="endDate"
                            rules={[]}
                        >
                            <DatePicker
                                disabled
                                style={{ width: "100%" }}
                                suffixIcon={<CalendarOutlined />}
                                // disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[10, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Complete Date"
                            name="completeDate"
                            rules={[
                                { required: true, message: "Please select complete date" }
                            ]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                suffixIcon={<CalendarOutlined />}
                                // disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Status" name="taskStatus" valuePropName="checked">
                            <Switch style={{ width: "100%" }} checkedChildren="Complete" unCheckedChildren="Pending" defaultChecked
                                    className="custom-switch"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-end items-center">
                    <Col xs={24} sm={24} className="sm:mt-10">
                        <Form.Item className="flex justify-end">
                        <Button loading={isLoading} color="default" variant="solid" htmlType="submit">
                            {isEditing ? "Update Task" : "Create Task"}
                        </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default TaskForm;