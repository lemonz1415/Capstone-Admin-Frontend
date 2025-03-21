export function convertDateToEN(date: Date | string): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // ใช้ 24 ชั่วโมง (true = 12 ชั่วโมง AM/PM)
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1
  const day = date.getDate().toString().padStart(2, "0"); // Pad day with leading zero if needed

  return `${year}-${month}-${day}`;
}

export function convertDateToENWithoutTime(date: Date | string): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export const convertRoleToReadable = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "QUESTION_CREATOR":
      return "Question Creator";
    case "TESTER":
      return "Tester";
  }
};
