export class Projects {
  _id : string;
  title : string;
  author : string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  investors: string[];
  category: string;
  startDate: Date;
  endDate: Date;
  remainingDays : number;

  fundPercent : number;
  coverImage : string;
}
