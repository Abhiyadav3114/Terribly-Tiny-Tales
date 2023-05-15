import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const fetchData = async () => {
  const response = await fetch('https://www.terriblytinytales.com/test.txt');
  const data = await response.text();
  return data;
};

const getHistogramData = (data) => {
  const words = data.split(/\s+/);
  const frequencies = {};
  words.forEach((word) => {
    frequencies[word] = frequencies[word] || 0;
    frequencies[word]++;
  });
  const sortedWords = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
  const histogramData = sortedWords.slice(0, 20).map((word) => ({ word, frequency: frequencies[word] }));
  return histogramData;
};

const exportHistogramData = (data) => {
  const csvContent = `data:text/csv;charset=utf-8,${data.map((row) => `${row.word},${row.frequency}`).join('\n')}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'histogram.csv');
  document.body.appendChild(link);
  link.click();
};

const Histogram = () => {
  const [histogramData, setHistogramData] = useState([]);

  const handleFetchData = async () => {
    const data = await fetchData();
    const histogramData = getHistogramData(data);
    setHistogramData(histogramData);
  };

  const handleExportData = () => {
    exportHistogramData(histogramData);
  };

  return (
    <div>
      <button onClick={handleFetchData}>Submit</button>
      {histogramData.length > 0 && (
        <div>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="frequency" fill="black" />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={handleExportData}>Export</button>
        </div>
      )}
    </div>
  );
};

export default Histogram;
