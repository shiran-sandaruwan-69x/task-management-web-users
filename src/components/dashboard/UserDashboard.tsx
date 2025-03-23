import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/layout/Sidebar";
import TaskManagement from "../tasks/TaskManagement"
import {CheckSquare, Users} from "lucide-react";
import {navItemsTypes} from "@/components/common-types/AuthTypes.ts";
import Header from "@/layout/Header.tsx";

const UserDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems:navItemsTypes[] = [
    {
      title: "Task Management",
      icon: <CheckSquare size={24}/>,
      path: "/users/tasks",
    },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
      <div className="flex h-screen bg-background">
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} navItems={navItems}/>

        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <Header sidebarCollapsed={sidebarCollapsed} headerText="Users Dashboard"/>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <Routes>
              <Route path="/tasks" element={<TaskManagement />} />
              <Route path="/" element={<Navigate to="/users/tasks" replace />} />
              <Route path="*" element={<Navigate to="/users/tasks" replace />} />
            </Routes>
          </main>
        </div>
      </div>
  );
};

export default UserDashboard;
