import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { DisplayDuration } from './__generated__/graphql.ts';

import CalendarDay from './CalendarDay.tsx';
import CalendarMonth from './CalendarMonth.tsx';
import CalendarThreeDay from './CalendarThreeDay.tsx';
import Encouragement from './Encouragement.tsx';
import ModalCreateGoal from './ModalCreateGoal.tsx';
import ModalEditGoal from './ModalEditGoal.tsx';
import { gqlGetUser } from './GQLQueries.tsx';
import GQLError from './GQLError.tsx';
import UserHeader from './UserHeader.tsx';

function RenderCalendar(displayDuration: DisplayDuration) {
  switch (displayDuration) {
    case DisplayDuration.Day:
      return <CalendarDay></CalendarDay>;
    case DisplayDuration.ThreeDay:
      return <CalendarThreeDay></CalendarThreeDay>;
    case DisplayDuration.Month:
      return <CalendarMonth></CalendarMonth>
  }
}

export default function User() {
  const [modalEditGoalIsOpen, setModalEditGoalIsOpen] = useState(false);
  const [displayDuration, setDisplayDuration] = useState(DisplayDuration.Day);

  const openModalEditGoal = () => {
    setModalEditGoalIsOpen(true);
  };

  const closeModalEditGoal = () => {
    setModalEditGoalIsOpen(false);
  };

  const [modalCreateGoalIsOpen, setModalCreateGoalIsOpen] = useState(false);

  const openModalCreateGoal = () => {
    setModalCreateGoalIsOpen(true);
  };

  const closeModalCreateGoal = () => {
    setModalCreateGoalIsOpen(false);
  };

  const { loading, error, data } = useQuery(gqlGetUser);

  if (loading) return null;
  if (error) return <GQLError error={error}></GQLError>;

  const goalNames = data?.user.goals.map((goal) => goal.name);

  return  (
  <div className="m-2">
    <UserHeader
      displayDuration={displayDuration}
      setDisplayDuration={setDisplayDuration}
      openModalEditGoal={openModalEditGoal}
      openModalCreateGoal={openModalCreateGoal}>
    </UserHeader>
    {data?.user && RenderCalendar(displayDuration)}
    {modalEditGoalIsOpen && (
      <ModalEditGoal
        closeModal={closeModalEditGoal}
        goalNames={goalNames}>
      </ModalEditGoal>
    )}
    {modalCreateGoalIsOpen && (
      <ModalCreateGoal
        closeModal={closeModalCreateGoal}>
      </ModalCreateGoal>
    )}
    <Encouragement></Encouragement>
  </div>
  )
}
