import { useState } from 'react';
import { S0, S1 } from '../../utils/sboxLookup';
import './SBoxMatrix.css';

/**
 * SBoxMatrix - Interactive S-Box matrix with cell highlight
 * @param {Object} props
 * @param {'S0'|'S1'} props.which - Which S-box to display
 * @param {{ row: number, col: number }|null} props.highlight - Cell to highlight
 * @param {string} props.className
 */
export default function SBoxMatrix({
  which = 'S0',
  highlight = null,
  className = '',
}) {
  const matrix = which === 'S0' ? S0 : S1;
  const [hovered, setHovered] = useState(null);

  return (
    <div className={`sbox-matrix ${className}`}>
      <div className="sbox-matrix__header">
        <span className="sbox-matrix__icon">⊞</span>
        <span className="sbox-matrix__title">S-BOX {which}</span>
      </div>
      <table className="sbox-matrix__table">
        <thead>
          <tr>
            <th className="sbox-matrix__corner"></th>
            {['00', '01', '10', '11'].map((col, i) => (
              <th key={col} className={`sbox-matrix__col-header ${highlight?.col === i ? 'sbox-matrix__col-header--active' : ''}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, ri) => (
            <tr key={ri}>
              <td className={`sbox-matrix__row-header ${highlight?.row === ri ? 'sbox-matrix__row-header--active' : ''}`}>
                {ri.toString(2).padStart(2, '0')}
              </td>
              {row.map((val, ci) => {
                const isHighlighted = highlight?.row === ri && highlight?.col === ci;
                const isHovered = hovered?.row === ri && hovered?.col === ci;
                return (
                  <td
                    key={ci}
                    className={`sbox-matrix__cell ${isHighlighted ? 'sbox-matrix__cell--highlighted' : ''} ${isHovered ? 'sbox-matrix__cell--hovered' : ''}`}
                    onMouseEnter={() => setHovered({ row: ri, col: ci })}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {val.toString(2).padStart(2, '0')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {highlight && (
        <div className="sbox-matrix__info">
          <span className="sbox-matrix__info-icon">ℹ</span>
          <span>
            Baris ditentukan oleh bit ke-1 dan ke-4. Kolom ditentukan oleh bit ke-2 dan ke-3.
            {highlight && ` Input ${which} memasukkan ke baris ${highlight.row.toString(2).padStart(2, '0')} kolom ${highlight.col.toString(2).padStart(2, '0')}, menghasilkan output ${matrix[highlight.row][highlight.col].toString(2).padStart(2, '0')}.`}
          </span>
        </div>
      )}
    </div>
  );
}
