import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard({ tasks }) {
  const today = new Date();

  const getTaskStatus = (task) => {
    if (task.completed) return "completed";
    if (!task.dueDate) return "no-due";
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "due-today";
    return "upcoming";
  };

  const taskMetrics = {
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
    overdue: tasks.filter((task) => getTaskStatus(task) === "overdue").length,
    dueToday: tasks.filter((task) => getTaskStatus(task) === "due-today").length,
    upcoming: tasks.filter((task) => getTaskStatus(task) === "upcoming").length,
    noDue: tasks.filter((task) => getTaskStatus(task) === "no-due").length,
  };

  const chartData = {
    labels: ["Active", "Completed", "Overdue", "Due Today", "Upcoming"],
    datasets: [
      {
        data: [
          taskMetrics.active,
          taskMetrics.completed,
          taskMetrics.overdue,
          taskMetrics.dueToday,
          taskMetrics.upcoming,
        ],
        backgroundColor: [
          "#4a90e2",
          "#28a745",
          "#dc3545",
          "#ffc107",
          "#17a2b8",
        ],
        borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll render a custom legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  const legendItems = [
    { label: "Active", color: "#4a90e2" },
    { label: "Completed", color: "#28a745" },
    { label: "Overdue", color: "#dc3545" },
    { label: "Due Today", color: "#ffc107" },
    { label: "Upcoming", color: "#17a2b8" },
  ];

  return (
    <div className="dashboard" style={{ background: "#f8fafd", borderRadius: 16, padding: '2rem', marginBottom: '2rem',marginTop: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h2 className="dashboard-title" style={{ fontSize: '2rem', marginBottom: 0, textAlign: 'center' }}>Task Overview</h2>
        <div className="quick-stats" style={{ display: 'flex', gap: '2rem', marginTop: '1rem', justifyContent: 'center' }}>
          <div className="stat-item total">
            <span className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: '#333' }}>{taskMetrics.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-item active">
            <span className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: '#333' }}>{taskMetrics.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item completed">
            <span className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: '#333' }}>{taskMetrics.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>
      <div className="dashboard-content" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
        <div className="chart-section" style={{ minWidth: 280, flex: '0 1 350px', height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="chart-container" style={{ width: 300, height: 300 }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-legend" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 180 }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, marginBottom: '0.5rem', color: '#333' }}>Legend</h3>
          {legendItems.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', background: item.color, border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}></span>
              <span style={{ fontWeight: 500, color: '#333', minWidth: 80 }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: item.color }}>{taskMetrics[item.label.replace(' ', '').toLowerCase()]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
