import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Download, Clock, Check } from 'lucide-react';

const MaintenanceLog = () => {
  const [date, setDate] = useState('8/11/2024');
  const [entries, setEntries] = useState([]);

  const addNewEntry = () => {
    setEntries([...entries, {
      slNo: entries.length + 1,
      maintenanceType: '',
      machineArea: '',
      workDescription: '',
      assigned: '',
      comments: '',
      status: 'pending'
    }]);
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const toggleStatus = (index) => {
    const newEntries = [...entries];
    newEntries[index].status = newEntries[index].status === 'done' ? 'pending' : 'done';
    setEntries(newEntries);
  };

  const wrapText = (text, maxWidth, fontSize = 14) => {
    if (!text) return [''];
    const words = text.toString().split(' ');
    const lines = [];
    let currentLine = words[0];
    
    const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
    
    for (let i = 1; i < words.length; i++) {
      if ((currentLine + ' ' + words[i]).length <= charsPerLine) {
        currentLine += ' ' + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const generateTableImage = () => {
    const columnWidths = {
      slNo: 80,
      maintenanceType: 180,
      machineArea: 180,
      workDescription: 220,
      assigned: 200,
      comments: 200,
      status: 80
    };

    const lineHeight = 20;
    const cellPadding = 10;
    const baseRowHeight = 60;
    const headerHeight = 50;
    const titleHeight = 100;

    // Calculate dynamic row heights based on content
    const rowHeights = entries.map(entry => {
      const maxLines = Math.max(
        1,
        wrapText(entry.maintenanceType, columnWidths.maintenanceType - 20).length,
        wrapText(entry.machineArea, columnWidths.machineArea - 20).length,
        wrapText(entry.workDescription, columnWidths.workDescription - 20).length,
        wrapText(entry.assigned, columnWidths.assigned - 20).length,
        wrapText(entry.comments, columnWidths.comments - 20).length
      );
      return Math.max(baseRowHeight, maxLines * lineHeight + 2 * cellPadding);
    });

    const totalWidth = Object.values(columnWidths).reduce((a, b) => a + b, 0);
    const totalHeight = titleHeight + headerHeight + rowHeights.reduce((a, b) => a + b, 0);

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}">
        <!-- Header Background -->
        <rect x="0" y="0" width="${totalWidth}" height="${titleHeight}" fill="#facc15"/>
        
        <!-- Title and Date -->
        <text x="40" y="60" font-family="Arial" font-size="32" font-weight="bold">Maintenance Log</text>
        <rect x="${totalWidth - 200}" y="25" width="160" height="50" fill="white" rx="8"/>
        <text x="${totalWidth - 180}" y="57" font-family="Arial" font-size="18" font-weight="bold">${date}</text>
        
        <!-- Table Header -->
        <rect x="0" y="${titleHeight}" width="${totalWidth}" height="${headerHeight}" fill="#f9fafb"/>
        
        <!-- Column Headers -->
        ${(() => {
          let x = 0;
          return Object.entries(columnWidths).map(([key, width]) => {
            const header = {
              slNo: 'Sl No',
              maintenanceType: 'Maintenance Type',
              machineArea: 'Machine/Area',
              workDescription: 'Work Description',
              assigned: 'Assigned',
              comments: 'Comments',
              status: 'Status'
            }[key];
            const text = `
              <g>
                <rect x="${x}" y="${titleHeight}" width="${width}" height="${headerHeight}" 
                      fill="#f9fafb" stroke="#e5e7eb"/>
                <text x="${x + width/2}" y="${titleHeight + 30}" 
                      font-family="Arial" font-size="14" font-weight="bold" 
                      text-anchor="middle">${header}</text>
              </g>
            `;
            x += width;
            return text;
          }).join('');
        })()}

        <!-- Table Content -->
        ${(() => {
          let y = titleHeight + headerHeight;
          return entries.map((entry, rowIndex) => {
            let x = 0;
            const rowHeight = rowHeights[rowIndex];
            const row = Object.entries(columnWidths).map(([key, width]) => {
              const content = entry[key] || '';
              const lines = key === 'status' ? 
                [entry.status === 'done' ? '✓' : '⌛'] : 
                wrapText(content.toString(), width - 20);
              
              const cell = `
                <g>
                  <rect x="${x}" y="${y}" width="${width}" height="${rowHeight}" 
                        fill="white" stroke="#e5e7eb"/>
                  ${lines.map((line, i) => `
                    <text x="${x + (key === 'status' || key === 'slNo' ? width/2 : 10)}" 
                          y="${y + cellPadding + (i * lineHeight)}"
                          font-family="Arial" font-size="14"
                          ${key === 'status' || key === 'slNo' ? 'text-anchor="middle"' : ''}
                          dominant-baseline="hanging">
                      ${line}
                    </text>
                  `).join('')}
                </g>
              `;
              x += width;
              return cell;
            }).join('');
            y += rowHeight;
            return row;
          }).join('');
        })()}
      </svg>
    `;

    // Create a new Image and canvas
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Convert SVG to data URL
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // When image loads, draw it to canvas and convert to JPG
    img.onload = () => {
      // Set canvas size with 2x scaling for better quality
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      
      // Scale the context for higher resolution
      ctx.scale(2, 2);
      
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, img.width, img.height);
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Convert to JPG and download
      canvas.toBlob((blob) => {
        const jpgUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = jpgUrl;
        link.download = `maintenance-log-${date}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(jpgUrl);
      }, 'image/jpeg', 1.0); // Maximum quality

      URL.revokeObjectURL(url);
    };

    // Set image source to SVG URL
    img.src = url;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-4 flex gap-4">
        <Button 
          onClick={addNewEntry}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} /> Add Entry
        </Button>
        <Button 
          onClick={generateTableImage}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Download size={16} /> Generate Image
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="bg-yellow-500 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Maintenance Log</h1>
          <Input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-32 bg-white rounded-lg"
          />
        </div>

        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-3 bg-gray-50 text-left w-20">Sl No</th>
                <th className="border p-3 bg-gray-50 text-left w-44">Maintenance Type</th>
                <th className="border p-3 bg-gray-50 text-left w-44">Machine/Area</th>
                <th className="border p-3 bg-gray-50 text-left w-52">Work Description</th>
                <th className="border p-3 bg-gray-50 text-left w-48">Assigned</th>
                <th className="border p-3 bg-gray-50 text-left w-48">Comments</th>
                <th className="border p-3 bg-gray-50 text-left w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="border p-3">
                    <Input value={entry.slNo} readOnly className="w-full" />
                  </td>
                  <td className="border p-3">
                    <Input
                      value={entry.maintenanceType}
                      onChange={(e) => updateEntry(index, 'maintenanceType', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-3">
                    <Input
                      value={entry.machineArea}
                      onChange={(e) => updateEntry(index, 'machineArea', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-3">
                    <Input
                      value={entry.workDescription}
                      onChange={(e) => updateEntry(index, 'workDescription', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-3">
                    <Input
                      value={entry.assigned}
                      onChange={(e) => updateEntry(index, 'assigned', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-3">
                    <Input
                      value={entry.comments}
                      onChange={(e) => updateEntry(index, 'comments', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => toggleStatus(index)}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {entry.status === 'done' ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-600" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceLog;