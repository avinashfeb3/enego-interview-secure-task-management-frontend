import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import taskAPI from "../services/taskService";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Button from "../components/Button";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import SkeletonLoader from "../components/SkeletonLoader";
import { Plus, LogOut, Search, Filter } from "lucide-react";

export const TasksPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { success: showSuccess, error: showError } = useNotification();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState({});

  // Fetch tasks
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks", { page, limit, search, statusFilter, priorityFilter }],
    queryFn: () =>
      taskAPI.getTasks({
        page,
        limit,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: search || undefined,
      }),
    staleTime: 30000,
    retry: 2,
  });

  const tasks = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  // Create/Update task
  const updateMutation = useMutation({
    mutationFn: (formData) => {
      if (editingTask) {
        return taskAPI.updateTask(editingTask._id, formData);
      }
      return taskAPI.createTask({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsModalOpen(false);
      setEditingTask(null);
      setOptimisticUpdates({});
      showSuccess(
        editingTask
          ? "Task updated successfully!"
          : "Task created successfully!",
      );
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to save task");
      setOptimisticUpdates({});
    },
  });

  // Delete task
  const deleteMutation = useMutation({
    mutationFn: (taskId) => taskAPI.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSuccess("Task deleted successfully!");
      setOptimisticUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[`delete-${editingTask}`];
        return newUpdates;
      });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete task");
      setOptimisticUpdates({});
    },
  });

  // Toggle completion
  const toggleMutation = useMutation({
    mutationFn: (taskId) => {
      const task = tasks.find((t) => t._id === taskId);
      return taskAPI.updateTask(taskId, {
        status: task.status === "Completed" ? "Pending" : "Completed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSuccess("Task updated!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update task");
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
    showSuccess("Logged out successfully");
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = useCallback(
    (taskId) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        setOptimisticUpdates((prev) => ({
          ...prev,
          [`delete-${taskId}`]: true,
        }));
        deleteMutation.mutate(taskId);
      }
    },
    [deleteMutation],
  );

  const handleSubmitTask = (formData) => {
    updateMutation.mutate(formData);
  };

  const handleToggleComplete = useCallback(
    (taskId, currentStatus) => {
      setOptimisticUpdates((prev) => ({
        ...prev,
        [`toggle-${taskId}`]:
          currentStatus === "Completed" ? "Pending" : "Completed",
      }));
      toggleMutation.mutate(taskId);
    },
    [toggleMutation],
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setPage(1);
  };

  const displayTasks = tasks
    .map((task) => {
      const toggleKey = `toggle-${task._id}`;
      const deleteKey = `delete-${task._id}`;

      if (deleteKey in optimisticUpdates) {
        return null;
      }

      if (toggleKey in optimisticUpdates) {
        return {
          ...task,
          status: optimisticUpdates[toggleKey],
        };
      }

      return task;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Tasks
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Welcome, <span className="font-semibold text-gray-800">{user?.name}</span>
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={handleLogout}
              className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 sm:py-2 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Actions Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleCreateTask}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span>New Task</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100">

  {/* Top Controls (Single Row) */}
  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">

    {/* Search */}
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && search.trim()) {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          }
        }}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-10"
      />

      <button
        type="button"
        onClick={() => {
          if (search.trim()) {
            setPage(1);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          }
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>

    {/* Status Filter */}
    <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setPage(1);
      }}
      className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-w-[150px]"
    >
      <option value="">All Status</option>
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
    </select>

    {/* Priority Filter */}
    <select
      value={priorityFilter}
      onChange={(e) => {
        setPriorityFilter(e.target.value);
        setPage(1);
      }}
      className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-w-[150px]"
    >
      <option value="">All Priority</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>

    {/* Reset Button */}
    {(search || statusFilter || priorityFilter) && (
      <Button
        variant="ghost"
        onClick={handleResetFilters}
        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        <Filter className="w-4 h-4" />
        Reset
      </Button>
    )}
  </div>

  {/* Results Info */}
  <div className="mt-3 text-xs sm:text-sm text-gray-600 font-medium">
    <span className="text-blue-600 font-semibold">{displayTasks.length}</span> of{" "}
    <span className="text-blue-600 font-semibold">{pagination.total}</span> tasks
    {(search || statusFilter || priorityFilter) && (
      <span className="ml-2 text-amber-600">(filtered)</span>
    )}
  </div>

</div>
        </div>

        {/* Tasks Content */}
        <div>
          {isLoading ? (
            <SkeletonLoader count={5} />
          ) : isError ? (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 sm:p-6 shadow-md">
              <p className="text-red-800 font-medium text-sm sm:text-base">
                Failed to load tasks: {error?.message || "Unknown error"}
              </p>
            </div>
          ) : displayTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center border border-slate-100">
              <div className="text-gray-400 text-5xl mb-4">📝</div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                {tasks.length === 0
                  ? "No tasks yet. Create your first task to get started!"
                  : "No tasks match your filters."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-bold text-slate-700">Title</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-bold text-slate-700">Priority</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-bold text-slate-700">Due Date</th>
                      <th className="px-4 lg:px-6 py-4 text-right text-sm font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {displayTasks.map((task, idx) => (
                      <tr
                        key={task._id}
                        className={`hover:bg-blue-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}
                      >
                        {/* Title */}
                        <td className="px-4 lg:px-6 py-4">
                          <p className="font-semibold text-gray-800 text-sm">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 lg:px-6 py-4">
                          <button
                            onClick={() => handleToggleComplete(task._id, task.status)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${
                              task.status === "Completed"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {task.status}
                          </button>
                        </td>

                        {/* Due Date */}
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </td>

                        {/* Actions */}
                        <td className="px-4 lg:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              disabled={`delete-${task._id}` in optimisticUpdates}
                              className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {displayTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 text-base mb-1">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                      )}
                    </div>

                    {/* Card Meta */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <button
                        onClick={() => handleToggleComplete(task._id, task.status)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </button>

                      <span className="text-xs text-gray-500 font-medium ml-auto">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="flex-1 px-3 py-2.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={`delete-${task._id}` in optimisticUpdates}
                        className="flex-1 px-3 py-2.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 sm:mt-10">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 sm:p-6">
              {/* Info Section */}
              <div className="text-center sm:text-left mb-4 pb-3 sm:mb-0">
                <p className="text-sm text-gray-600 font-medium">
                  Page <span className="text-blue-600 font-bold">{pagination.page}</span> of{" "}
                  <span className="text-blue-600 font-bold">{pagination.totalPages}</span> •{" "}
                  <span className="text-gray-700 font-semibold">{displayTasks.length}</span> tasks shown
                </p>
              </div>

              {/* Controls Section */}
              <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 mt-4 sm:mt-0">
                {/* Pagination Buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-1 lg:gap-2 overflow-x-auto">
                  {/* Previous */}
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white hover:bg-blue-50 border-slate-300 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    ← Prev
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNumber = i + 1;

                      if (
                        pageNumber === 1 ||
                        pageNumber === pagination.totalPages ||
                        Math.abs(pageNumber - page) <= 1
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                              page === pageNumber
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-white border border-slate-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }

                      if (pageNumber === page - 2 || pageNumber === page + 2) {
                        return (
                          <span key={pageNumber} className="px-2 text-gray-400 font-bold">
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={page === pagination.totalPages}
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      page === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white hover:bg-blue-50 border-slate-300 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    Next →
                  </button>
                </div>

                {/* Per Page Selector */}
                <div className="flex items-center justify-center gap-2">
                  <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
                    Per page:
                  </label>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer font-medium"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};

export default TasksPage;
