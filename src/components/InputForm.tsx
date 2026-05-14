import React, { useState, useEffect } from 'react';
import type { AlgorithmType } from '../hooks/useAlgorithm';

interface InputFormProps {
  algorithm: AlgorithmType;
  onRun: (params: Record<string, number>) => void;
  onModeChange: (type: AlgorithmType) => void;
}

const InputForm: React.FC<InputFormProps> = ({ algorithm, onRun, onModeChange }) => {
  const [params, setParams] = useState<Record<string, string>>({});

  const isLineMode = algorithm === 'bresenham' || algorithm === 'dda';

  useEffect(() => {
    if (isLineMode) {
      setParams({ x0: '0', y0: '0', x1: '8', y1: '5' });
    } else if (algorithm === 'circle') {
      setParams({ r: '8', cx: '0', cy: '0' });
    } else if (algorithm === 'ellipse') {
      setParams({ rx: '8', ry: '5', cx: '0', cy: '0' });
    }
  }, [algorithm, isLineMode]);

  useEffect(() => {
    const numericParams: Record<string, number> = {};
    let isValid = true;
    
    const requiredKeys = isLineMode ? ['x0', 'y0', 'x1', 'y1'] : 
                         algorithm === 'circle' ? ['r', 'cx', 'cy'] : ['rx', 'ry', 'cx', 'cy'];

    requiredKeys.forEach(key => {
      if (params[key] === undefined || params[key] === '') isValid = false;
      numericParams[key] = parseInt(params[key], 10) || 0;
    });

    if (isValid && Object.keys(params).length > 0) {
      onRun(numericParams);
    }
  }, [params, algorithm, onRun, isLineMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-snow-white rounded-xl border-2 border-cloud-gray shadow-cloud-gray">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading-sm font-bold text-charcoal">Parámetros</h3>
          <p className="text-caption font-bold text-sky-blue uppercase tracking-wider mt-1">
            {algorithm === 'circle' ? 'Algoritmo de Círculo' : 
             algorithm === 'ellipse' ? 'Algoritmo de Elipse' : 
             'Algoritmo de Línea'}
          </p>
        </div>
      </div>

      {isLineMode && (
        <div className="flex bg-cloud-gray/30 p-1 rounded-xl">
          <button
            onClick={() => onModeChange('bresenham')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              algorithm === 'bresenham' ? 'bg-snow-white text-sky-blue shadow-sm' : 'text-silver hover:text-charcoal'
            }`}
          >
            Bresenham
          </button>
          <button
            onClick={() => onModeChange('dda')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              algorithm === 'dda' ? 'bg-snow-white text-sky-blue shadow-sm' : 'text-silver hover:text-charcoal'
            }`}
          >
            DDA
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {isLineMode && (
          <>
            <InputGroup label="X0" name="x0" value={params.x0} onChange={handleChange} />
            <InputGroup label="Y0" name="y0" value={params.y0} onChange={handleChange} />
            <InputGroup label="X1" name="x1" value={params.x1} onChange={handleChange} />
            <InputGroup label="Y1" name="y1" value={params.y1} onChange={handleChange} />
          </>
        )}
        {algorithm === 'circle' && (
          <>
            <div className="col-span-2">
              <InputGroup label="Radio (R)" name="r" value={params.r} onChange={handleChange} />
            </div>
            <InputGroup label="Centro X" name="cx" value={params.cx} onChange={handleChange} />
            <InputGroup label="Centro Y" name="cy" value={params.cy} onChange={handleChange} />
          </>
        )}
        {algorithm === 'ellipse' && (
          <>
            <InputGroup label="RX (Horizontal)" name="rx" value={params.rx} onChange={handleChange} />
            <InputGroup label="RY (Vertical)" name="ry" value={params.ry} onChange={handleChange} />
            <InputGroup label="Centro X" name="cx" value={params.cx} onChange={handleChange} />
            <InputGroup label="Centro Y" name="cy" value={params.cy} onChange={handleChange} />
          </>
        )}
      </div>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-caption font-bold text-silver uppercase tracking-wider">{label}</label>
    <input
      type="number"
      name={name}
      value={value !== undefined ? value : ''}
      onChange={onChange}
      className="bg-snow-white border-2 border-cloud-gray text-charcoal font-bold text-body p-4 rounded-xl focus:outline-none focus:border-sky-blue transition-all"
    />
  </div>
);

export default InputForm;
