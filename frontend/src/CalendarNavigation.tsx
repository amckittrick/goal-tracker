import './CalendarNavigation.css';

export default function CalendarNavigation(
  {
    onClick,
    currentDate,
    setDate,
    loading
  }:
  {
    onClick: (offset: number | null, currentDate: Date, setDate: React.Dispatch<React.SetStateAction<Date>>) => void,
    currentDate: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>,
    loading: boolean
  }
) {

  return (
    <div className="CalendarNavigation">
      <button
        data-testid="CalendarNavigationDecrement"
        className={`btn bi bi-chevron-left ${loading ? 'disabled-no-border' : ''}`}
        onClick={() => onClick(-1, currentDate, setDate)}>
      </button>
      <button
        data-testid="CalendarNavigationReset"
        className={`btn ${loading ? 'disabled-no-border' : ''}`}
        onClick={() => onClick(null, currentDate, setDate)}>
          Today
      </button>
      <button
        data-testid="CalendarNavigationIncrement"
        className={`btn bi bi-chevron-right ${loading ? 'disabled-no-border' : ''}`}
        onClick={() => onClick(1, currentDate, setDate)}>
      </button>
    </div>
  )
}