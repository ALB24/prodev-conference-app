import React, { useState } from 'react';
import Table from '../../common/table';
import PresentationStatusPrompt from './presentationStatusPrompt';


const PresentationsTable = ({eventId, presentations, reloadList}) => {
  const [sortColumn, setSortColumn] = useState({ path: 'title', order: 'asc' });
  const { path, order } = sortColumn;

  presentations.sort((left, right) => {
    const l = left[path];
    const r = right[path];
    if (l === r) return 0;
    
    if (order === 'asc' && l < r) return -1;
    else if (order === 'asc') return 1;

    if (order === 'desc' && l < r) return 1;
    else return -1;
  });

  const columns = [
    { width: '250px', path: "title", label: "Title" },
    { path: "synopsis", label: "Synopsis" },
    { width: '160px', key: "name", label: "Presenter", content: ({presenterName, email}) => <a href={`mailto:${email}`}>{presenterName}</a> },
    { width: '140px', key: "status", label: "Status", content: ({id, status}) => <PresentationStatusPrompt status={status} id={id} eventId={eventId} reloadList={reloadList} /> },
  ];

  return (
    <Table
      columns={columns}
      data={presentations}
      sortColumn={sortColumn}
      onSort={setSortColumn}
    />
  );
};

export default PresentationsTable;
