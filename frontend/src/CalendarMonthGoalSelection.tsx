import "./CalendarMonth.css"

function handleGoalChange(goalName: string, setGoal: React.Dispatch<React.SetStateAction<string | null>>) {
  setGoal(goalName);
}

export default function CalendarMonthGoalSelection(
  {goalNameOptions, setGoal}: {goalNameOptions: string[], setGoal: React.Dispatch<React.SetStateAction<string | null>>}
) {
  return (
    <ul className="calendar-weekdays p-0">
      <label htmlFor="CalendarMonthGoalSelection" className="d-none">
        Select Goal
      </label>
      <select
        id="CalendarMonthGoalSelection"
        className="form-select d-inline-block"
        aria-label="Goal To View"
        style={{maxWidth: "300px"}}
        onChange={(event) => {
          handleGoalChange(event.target.value, setGoal);
        }}
        defaultValue="Select Goal"
        disabled={goalNameOptions.length === 0}>
        <option>Select Goal</option>
        {
          goalNameOptions.map((goalName) =>
          <option key={goalName} value={goalName}>{goalName}</option>
        )}
      </select>
    </ul>
  
  );
}