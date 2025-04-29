import { GoalFrequencyType, GoalType, GoalStatusType, UserType, ActivityStatus } from "./__generated__/graphql";

export class User implements UserType {
    email: string
    fullname: string;
    goals: GoalType[];
    id: number;

    constructor() {
        this.email = 'fake.user@fake.com';
        this.fullname = 'Fake User';
        this.goals = [];
        this.id = 1;
    }
}

export class GoalStatus implements GoalStatusType {
    name: string;
    frequency: GoalFrequencyType;
    dates: Date[];
    statuses: ActivityStatus[][];

    constructor(frequency: GoalFrequencyType, dates: Date[], statuses: ActivityStatus[][]) {
        this.name = 'Fake ' + frequency + ' Goal';
        this.frequency = frequency;
        this.dates = dates;
        this.statuses = statuses;
    }
}
