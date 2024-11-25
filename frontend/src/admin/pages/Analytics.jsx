import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (startDate && endDate) {
            fetchChartData();
        }
    }, [startDate, endDate]);

    const fetchChartData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:8000/sales-data`,
                {
                    params: {
                        startDate: startDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
                        endDate: endDate.toISOString().split('T')[0],
                    },
                }
            );
            console.log(res)

            const dates = res.data.data.map(item =>
                `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}` || null
            );
            const totalSales = res.data.data.map(item => item.totalSales);

            const data = {
                labels: dates, // X-axis labels
                datasets: [
                    {
                        label: 'Sales',
                        data: totalSales, // Y-axis data
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        tension: 0.4,
                    },
                ],
            };

            setChartData(data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Chart',
            },
        },
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="chart-container">
                {loading && <div>Loading...</div>}
                {!loading && chartData && <Line data={chartData} options={options} />}
            </div>
            <div className='analytics-control'>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                />
            </div>
        </LocalizationProvider>
    );
};

export default Analytics;