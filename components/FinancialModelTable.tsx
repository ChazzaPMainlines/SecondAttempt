
import React from 'react';
import { FinancialMetric } from '../types';

interface FinancialModelTableProps {
  financials: FinancialMetric[];
}

export const FinancialModelTable: React.FC<FinancialModelTableProps> = ({ financials }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold font-display text-white mb-4">Financial Operating Model (5-Year Forecast)</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-text-secondary">
          <thead className="text-xs text-brand-highlight uppercase bg-brand-primary">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Year</th>
              <th scope="col" className="px-6 py-3">Revenue (USD M)</th>
              <th scope="col" className="px-6 py-3">EBITDA (USD M)</th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">DSCR</th>
            </tr>
          </thead>
          <tbody>
            {financials.map((row, index) => (
              <tr key={row.year} className={`border-b border-brand-primary ${index === financials.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-6 py-4 font-mono font-bold text-brand-highlight">{row.year}</td>
                <td className="px-6 py-4 font-mono">{row.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 font-mono">{row.ebitda.toLocaleString()}</td>
                <td className={`px-6 py-4 font-mono font-bold ${row.dscr < 1.2 ? 'text-danger' : 'text-success'}`}>
                  {row.dscr.toFixed(2)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};