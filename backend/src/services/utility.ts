import { User } from "../entity/User";

export const dateDifference = (dateToCompare: string, currentDate: Date = new Date()): number => {
  let date_diff = ((currentDate.getTime() - new Date(dateToCompare).getTime())/1000)/60;
  return Math.abs(Math.round(date_diff));
}

export const checkUserActiveLocked = (user: User): boolean => {
  return user && user.active && !user.accountLocked;
}