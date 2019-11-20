import * as React from 'react';
import { css } from 'emotion';
import { Dialog, DialogContent } from '@material-ui/core';
import { OpenWith } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { paths } from '../constants/paths';
import { Task, TaskStatus } from '../models/models';
import { TaskForm } from './TaskForm';

type Props = {
  open: boolean;
  onClose: () => void;
  onAddNewTask: ({
    taskAttributeWithoutId,
  }: {
    taskAttributeWithoutId: Pick<Task, 'title' | 'content' | 'labels' | 'status'>;
  }) => void;
  title: string;
  content: string;
  status: TaskStatus;
  labels: string[];
  onChangeTitle: (value: string) => void;
  onChangeContent: (value: string) => void;
  onChangeStatus: (value: TaskStatus) => void;
  onChangeLabels: (value: string[]) => void;
  onReset: () => void;
};

const dialogStyle = css({
  '.MuiDialog-paper': {
    width: '70%',
    height: '70%',
  },
});

const linkStyle = css({
  textDecoration: 'none',
});

const openAsNewPageLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  color: '#808080',
  cursor: 'pointer',
  textDecoration: 'none',
  '> svg': {
    marginRight: 4,
  },
  '&:hover': {
    color: '#696969',
    textDecoration: 'underline',
  },
});

const formContainerStyle = css({
  padding: `40px 64px 64px`,
});

const labelTexts = ['front', 'server', 'infra', 'feat', 'bugfix', 'hotfix'];

export const CreateTaskDialog = ({
  open,
  onClose,
  onAddNewTask,
  title,
  content,
  status,
  labels,
  onChangeTitle,
  onChangeContent,
  onChangeStatus,
  onChangeLabels,
  onReset,
}: Props) => {
  const [error, setError] = React.useState(false);
  const titleError = React.useMemo(() => error && !title.trim(), [error, title]);
  const contentError = React.useMemo(() => error && !content.trim(), [error, content]);
  const errorCondition = React.useMemo(() => !title.trim() || !content.trim(), [title, content]);
  const handleCloseDialog = React.useCallback(() => {
    setError(false);
    onReset();
    onClose();
  }, []);
  const handleClickSubmit = React.useCallback(() => {
    setError(errorCondition);
    if (errorCondition) return;
    onAddNewTask({
      taskAttributeWithoutId: { title, content, status, labels },
    });
    setError(false);
    onReset();
    onClose();
  }, [errorCondition, title, content, status, labels]);

  return (
    <Dialog className={dialogStyle} open={open} onClose={handleCloseDialog} maxWidth="lg">
      <DialogContent>
        <header>
          <Link to={paths.tasks.new} className={linkStyle}>
            <span className={openAsNewPageLinkStyle}>
              <OpenWith />
              ページとして開く
            </span>
          </Link>
        </header>
        <div className={formContainerStyle}>
          <TaskForm
            title={title}
            content={content}
            status={status}
            labels={labels}
            labelTexts={labelTexts}
            onChangeTitle={onChangeTitle}
            onChangeContent={onChangeContent}
            onChangeStatus={onChangeStatus}
            onChangeLabels={onChangeLabels}
            onClickSubmit={handleClickSubmit}
            titleError={titleError}
            contentError={contentError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
