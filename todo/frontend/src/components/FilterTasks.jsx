import './FilterTasks.css';

function FilterTasks({ setFilter, currentFilter, tasks }) {
  const filters = ['All', 'Active', 'Completed', 'Overdue', 'Due Today', 'Upcoming'];
  const categories = ['None', 'Work', 'Personal', 'Shopping'].map((cat) => `Category:${cat}`);

  return (
    <div className="filter-tasks">
      {filters.concat(categories).map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={`filter-button ${currentFilter === filter ? 'active' : ''}`}
          aria-label={`Filter by ${filter}`}
        >
          {filter.startsWith('Category:') ? filter.split(':')[1] : filter}
        </button>
      ))}
    </div>
  );
}

export default FilterTasks;