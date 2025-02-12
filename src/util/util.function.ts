export function convertDateToEN(date: Date | string): string {
  // ตรวจสอบว่า date เป็น instance ของ Date หรือไม่
  if (!(date instanceof Date)) {
    date = new Date(date); // ถ้าไม่ใช่, ให้แปลงเป็น Date
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // ใช้ Intl.DateTimeFormat เพื่อจัดรูปแบบวันที่ตาม en-US
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
}
