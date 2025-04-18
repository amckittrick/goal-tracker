import { useState } from 'react';

import { ActivityType } from './__generated__/graphql.ts';

import CalendarSingleDay from './CalendarSingleDay.tsx';
import CalendarSingleWeek from './CalendarSingleWeek.tsx';


import "./Calendar.css"


function RenderDays(
  year: number,
  month: number,
  activities: ActivityType[],
  requiredActivitiesPerPeriod: number,
  goalName: string,
  currentUserEmail: string,
) {
  const currentMonthFirstDayOfWeek = new Date(year, month, 1).getDay();
  const currentMonthLastDate = new Date(year, month + 1, 0).getDate();
  const currentMonthLastDay = new Date(year, month, currentMonthLastDate).getDay();
  const previousMonthLastDate = new Date(year, month, 0).getDate();
  const elements = [];

  // Loop to add the last dates of the previous month
  for (let index = currentMonthFirstDayOfWeek; index > 0; index--) {
    const dayOfMonth = previousMonthLastDate - index + 1;
    elements.push(
      <CalendarSingleDay
        key={`LastMonth${index}`}
        year={year}
        month={month - 1}
        date={dayOfMonth}
        activities={activities}
        requiredActivitiesPerPeriod={requiredActivitiesPerPeriod}
        goalName={goalName}
        currentUserEmail={currentUserEmail}>
      </CalendarSingleDay>
    )
  }

  // Loop to add the dates of the current month
  for (let index = 1; index <= currentMonthLastDate; index++) {
    const dayOfMonth = index;
    elements.push(
      <CalendarSingleDay
        key={`ThisMonth${index}`}
        year={year}
        month={month}
        date={dayOfMonth}
        activities={activities}
        requiredActivitiesPerPeriod={requiredActivitiesPerPeriod}
        goalName={goalName}
        currentUserEmail={currentUserEmail}>
      </CalendarSingleDay>
    )
  }

  // Loop to add the first dates of the next month
  for (let index = currentMonthLastDay; index < 6; index++) {
    const dayOfMonth = index - currentMonthLastDay + 1;
    elements.push(
      <CalendarSingleDay
        key={`NextMonth${index}`}
        year={year}
        month={month + 1}
        date={dayOfMonth}
        activities={activities}
        requiredActivitiesPerPeriod={requiredActivitiesPerPeriod}
        goalName={goalName}
        currentUserEmail={currentUserEmail}>
      </CalendarSingleDay>
    )
  }

  return elements;
}

function RenderWeeks(
  year: number,
  month: number,
  activities: ActivityType[],
  requiredActivitiesPerPeriod: number,
  goalName: string,
  currentUserEmail: string,
) {
  const currentMonthFirstDayOfWeek = new Date(year, month, 1).getDay();
  const currentMonthLastDate = new Date(year, month + 1, 0).getDate();
  const currentMonthLastDay = new Date(year, month, currentMonthLastDate).getDay();
  const previousMonthLastDate = new Date(year, month, 0).getDate();
  const elements = [];

  elements.push(
    <CalendarSingleWeek
      key="LastMonth"
      year={year}
      month={month - 1}
      dateStart={previousMonthLastDate - currentMonthFirstDayOfWeek + 1}
      dateEnd={7 - currentMonthFirstDayOfWeek}
      activities={activities}
      requiredActivitiesPerPeriod={requiredActivitiesPerPeriod}
      goalName={goalName}
      currentUserEmail={currentUserEmail}>
    </CalendarSingleWeek>
  )

  for (let index = (8 - currentMonthFirstDayOfWeek); index < (currentMonthLastDate - currentMonthLastDay); index += 7) {
    elements.push(
      <CalendarSingleWeek
        key={`ThisMonth${index}`}
        year={year}
        month={month}
        dateStart={index}
        dateEnd={index + 6}
        activities={activities}
        requiredActivitiesPerPeriod={requiredActivitiesPerPeriod}
        goalName={goalName}
        currentUserEmail={currentUserEmail}>
      </CalendarSingleWeek>
    )
  }

  const nextMonthFirstWeekLastDate = (6 - currentMonthLastDay) == 0 ? currentMonthLastDate : 6 - currentMonthLastDay;
  elements.push(
    <CalendarSingleWeek
      key="NextMonth"
      year={year}
      month={month + 1}
      dateStart={currentMonthLastDate - currentMonthLastDay}
      dateEnd={nextMonthFirstWeekLastDate}
      activities={activities}
      requiredActivitiesPerPeriod={requiredActivitiesPerPeriod}
      goalName={goalName}
      currentUserEmail={currentUserEmail}>
    </CalendarSingleWeek>
  )

  return elements;
}

export default function Calendar(
  {
    activities,
    requiredActivitiesPerPeriod,
    goalName,
    currentUserEmail,
    daily,
    openModalEditGoal
  }:
  {
    activities: ActivityType[],
    requiredActivitiesPerPeriod: number,
    goalName: string,
    currentUserEmail: string,
    daily: boolean,
    openModalEditGoal: ( data: { goalName: string }) => void
  }
) {

  const handleEditGoalClick = () => {
    openModalEditGoal({ goalName: goalName });
  };

  function handleCalendarNavigationClick(offset: number) {
    const newMonth = month + offset;
    setMonth(newMonth);
    if (newMonth < 0 || newMonth > 11) {
      const newDate = new Date(year, newMonth, new Date().getDate())
      setDate(newDate);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    } else {
      setDate(new Date());
    }
  };

  const [date, setDate] = useState(new Date());
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <div className="card mb-2 border-primary">
      <div className="card-header p-1 bg-primary text-dark">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <h5 className="mx-2">{goalName}</h5>
          <h5>{months[month]} {year}</h5>
          <div>
            <i
              className="btn bi bi-chevron-left"
              onClick={() => handleCalendarNavigationClick(-1)}>
            </i>
            <i
              className="btn bi bi-chevron-right"
              onClick={() => handleCalendarNavigationClick(1)}>
            </i>
            <i
              className="btn bi bi-gear"
              onClick={() => handleEditGoalClick()}>
            </i>
          </div>
        </div>
      </div>
      <div className="card-body bg-dark">
        <div className="calendar-container">
          <div className="calendar-body">
            <ul className="calendar-weekdays d-flex flex-wrap p-0">
              <li>Sun</li>
              <li>Mon</li>
              <li>Tue</li>
              <li>Wed</li>
              <li>Thu</li>
              <li>Fri</li>
              <li>Sat</li>
            </ul>
            <ul className="calendar-dates d-flex flex-wrap p-0">
              {
                daily ? RenderDays(year, month, activities, requiredActivitiesPerPeriod, goalName, currentUserEmail) : RenderWeeks(year, month, activities, requiredActivitiesPerPeriod, goalName, currentUserEmail)
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}