import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import Button from './Button';

export const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, isDeleting }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'Pending';

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-amber-100 text-amber-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Completed'
      ? 'bg-green-100 text-green-700'
      : 'bg-blue-100 text-blue-700';
  };

  return (
    <div
      className={`card border-l-4 transition-all hover:shadow-lg ${
        task.status === 'Completed'
          ? 'border-green-500 opacity-80'
          : 'border-blue-500'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title with Completion Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleComplete(task._id, task.status)}
              className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
              aria-label={
                task.status === 'Completed'
                  ? 'Mark as pending'
                  : 'Mark as completed'
              }
            >
              {task.status === 'Completed' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <h3
              className={`text-base sm:text-lg font-bold truncate ${
                task.status === 'Completed'
                  ? 'line-through text-gray-500'
                  : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-gray-600 text-sm mt-2 ml-9 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4 ml-9">
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
            {isOverdue && (
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-red-100 text-red-700">
                🚨 Overdue
              </span>
            )}
          </div>

          {/* Due Date */}
          <p
            className={`text-xs sm:text-sm mt-3 ml-9 font-medium ${
              isOverdue ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            📅 Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-2 sm:p-2.5"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task._id)}
            loading={isDeleting}
            disabled={isDeleting}
            title="Delete task"
            className="p-2 sm:p-2.5"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
