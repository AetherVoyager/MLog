import React from 'react';
import { Input } from './ui/input';

const MaintenanceTable = ({ entries, updateEntry }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Sl No</th>
            <th className="border p-2">Maintenance Type</th>
            <th className="border p-2">Machine/Area</th>
            <th className="border p-2">Work Description</th>
            <th className="border p-2">Assigned</th>
            <th className="border p-2">Comments</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td className="border p-2">
                <Input
                  value={entry.slNo}
                  onChange={(e) => updateEntry(index, 'slNo', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <Input
                  value={entry.maintenanceType}
                  onChange={(e) => updateEntry(index, 'maintenanceType', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <Input
                  value={entry.machineArea}
                  onChange={(e) => updateEntry(index, 'machineArea', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <Input
                  value={entry.workDescription}
                  onChange={(e) => updateEntry(index, 'workDescription', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <Input
                  value={entry.assigned}
                  onChange={(e) => updateEntry(index, 'assigned', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <Input
                  value={entry.comments}
                  onChange={(e) => updateEntry(index, 'comments', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <Input
                  value={entry.status}
                  onChange={(e) => updateEntry(index, 'status', e.target.value)}
                  className="w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;
