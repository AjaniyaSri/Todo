import './SearchTasks.css';

interface SearchTasksProps {
  search: string;
  setSearch: (search: string) => void;
  sort: string;
  setSort: (sort: string) => void;
}

function SearchTasks({ search, setSearch, sort, setSort }: SearchTasksProps) {
  return (
    <div className="search-tasks">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="search-input"
        aria-label="Search tasks"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="sort-select"
        aria-label="Sort tasks"
      >
        <option value="default">Sort: Default</option>
        <option value="dueDate">Sort: Due Date</option>
        <option value="alphabetical">Sort: Alphabetical</option>
        <option value="category">Sort: Category</option>
      </select>
    </div>
  );
}

export default SearchTasks; 