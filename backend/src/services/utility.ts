import { User } from "../entity/User";

export const dateDifference = (dateToCompare: string, currentDate: Date = new Date()): number => {
  let date_diff = ((currentDate.getTime() - new Date(dateToCompare).getTime())/1000)/60;
  return Math.abs(Math.round(date_diff));
}

export const checkUserActiveLocked = (user: User): boolean => {
  return user && user.active && !user.accountLocked;
}

export const __terminateServer = (server, options = { coredump: false, timeout: 500 }) => {
  // Exit function
  const exit = code => {
    options.coredump ? process.abort() : process.exit(code);
  }

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      console.log(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  }
}