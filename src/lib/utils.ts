import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInitials(userName: string) {
  const namesArray = userName.split(" ");
  let firstLetters = [];
  if (namesArray.length === 1) {
    firstLetters = [namesArray[0].substring(0, 2)];
  } else {
    firstLetters = namesArray.map((name) => name.substring(0, 1));
  }
  return firstLetters.join("").toUpperCase().slice(0, 2);
}
