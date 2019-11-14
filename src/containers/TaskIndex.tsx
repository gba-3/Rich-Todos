import * as React from 'react';
import { TaskIndex } from '../components/TaskIndex';
import { Task, TaskStatus } from '../models/models';
import { fetchTasks, addTask, updateTask } from '../api/Task';

export const TaskIndexContainer = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const load = async () => {
    setLoading(true);
    const tasksData = await fetchTasks();
    setTasks(tasksData);
    setLoading(false);
  };

  const handleUpdateTaskStatus = ({ status, targetId }: { status: TaskStatus; targetId: number }) => {
    updateTask({ updateTaskAttribute: { status }, targetId });

    load();
  };
  const handleAddNewTask = ({
    taskAttributeWithoutId,
  }: {
    taskAttributeWithoutId: Pick<Task, 'title' | 'content' | 'labels' | 'status'>;
  }) => {
    const newTaskId = tasks.reduce((maxId, item) => (maxId < item.id ? item.id : maxId), 0) + 1;
    addTask({ taskAttribute: { ...taskAttributeWithoutId, id: newTaskId } });

    load();
  };
  React.useEffect(() => {
    load();
  }, []);

  return (
    <TaskIndex
      tasks={tasks}
      onUpdateTaskStatus={handleUpdateTaskStatus}
      onAddNewTask={handleAddNewTask}
      loading={loading}
    />
  );
};
