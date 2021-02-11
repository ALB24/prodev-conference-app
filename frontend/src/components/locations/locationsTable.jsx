import React, { Component } from "react";
import Table from "../../common/table";


class LocationsTable extends Component {
  columns = [
    { path: "name", label: "Name" },
    { width: '180px', path: "city", label: "City" },
    { width: '116px', path: "state", label: "State" },
    { width: '220px', path: "maximumVendorCount", label: "Maximum Vendor Count" },
    { width: '140px', path: "roomCount", label: "Room Count" },
  ];
  render() {
    const { locations, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={locations}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default LocationsTable;
