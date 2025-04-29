import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { DisplayDuration } from './__generated__/graphql.ts';

import { UserObject } from './App.tsx';
import CalendarDay from './CalendarDay.tsx';
import CalendarMonth from './CalendarMonth.tsx';
import CalendarThreeDay from './CalendarThreeDay.tsx';
import Encouragement from './Encouragement.tsx';
import ModalCreateGoal from './ModalCreateGoal.tsx';
import ModalEditGoal from './ModalEditGoal.tsx';
import { gqlGetUser } from './GQLQueries.tsx';
import UserHeader from './UserHeader.tsx';

function RenderCalendar(displayDuration: DisplayDuration, email: string) {
  switch (displayDuration) {
    case DisplayDuration.Day:
      return <CalendarDay currentUserEmail={email}></CalendarDay>;
    case DisplayDuration.ThreeDay:
      return <CalendarThreeDay currentUserEmail={email}></CalendarThreeDay>;
    case DisplayDuration.Month:
      return <CalendarMonth currentUserEmail={email}></CalendarMonth>
  }
}

export default function User({ user }: { user: UserObject }) {
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

  const { loading, error, data } = useQuery(gqlGetUser, {
    variables: { email: user.email }
  });

  if (loading) return null;
  if (error) return <p>Error : {error.message}</p>;

  const goalNames = data?.user.goals.map((goal) => goal.name);

  return  (
  <div className="m-2">
    <UserHeader
      displayDuration={displayDuration}
      setDisplayDuration={setDisplayDuration}
      openModalEditGoal={openModalEditGoal}
      openModalCreateGoal={openModalCreateGoal}>
    </UserHeader>
    {data?.user && RenderCalendar(displayDuration, data.user.email)}
    {modalEditGoalIsOpen && (
      <ModalEditGoal
        currentUserEmail={user.email}
        closeModal={closeModalEditGoal}
        goalNames={goalNames}>
      </ModalEditGoal>
    )}
    {modalCreateGoalIsOpen && (
      <ModalCreateGoal
        currentUserEmail={user.email}
        closeModal={closeModalCreateGoal}>
      </ModalCreateGoal>
    )}
    <Encouragement></Encouragement>
  </div>
  )
}
