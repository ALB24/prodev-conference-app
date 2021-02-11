import React, { useState } from 'react';
import Table from '../../common/table';


const PresentationsTable = ({eventId, presentations: attendees, reloadList}) => {
  const [sortColumn, setSortColumn] = useState({ path: 'title', order: 'asc' });
  const { path, order } = sortColumn;

  attendees.sort((left, right) => {
    const l = left[path];
    const r = right[path];
    if (l === r) return 0;
    
    if (order === 'asc' && l < r) return -1;
    else if (order === 'asc') return 1;

    if (order === 'desc' && l < r) return 1;
    else return -1;
  });

  const columns = [
    { width: '33%', path: "name", label: "Name" },
    { path: "email", label: "Email" },
    { width: '33%', path: "companyName", label: "Company name" },
  ];

  return (
    <Table
      columns={columns}
      data={attendees}
      sortColumn={sortColumn}
      onSort={setSortColumn}
    />
  );
};

export default PresentationsTable;
