export function convertDateToTH(date: Date | string): string {
  // ตรวจสอบว่า date เป็น instance ของ Date หรือไม่
  if (!(date instanceof Date)) {
    date = new Date(date); // ถ้าไม่ใช่, ให้แปลงเป็น Date
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // ใช้ Intl.DateTimeFormat เพื่อจัดรูปแบบวันที่ในภาษาไทย
  const thaiDate = new Intl.DateTimeFormat("th-TH", options).format(date);

  // แปลงปีจาก ค.ศ. เป็น พ.ศ.
  const thaiYear: number = date.getFullYear() + 543;
  const formattedDate: string = thaiDate.replace(
    date.getFullYear().toString(),
    thaiYear.toString()
  );

  return formattedDate;
}

// ตัวอย่างการใช้งาน
const date: Date = new Date();
console.log(convertDateToTH(date)); // เช่น "1 กุมภาพันธ์ 2568"
