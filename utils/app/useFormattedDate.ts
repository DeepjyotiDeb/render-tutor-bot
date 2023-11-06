import { useEffect, useState } from 'react';

export const useFormattedDate = () => {
  const [currentDateTime, setCurrentDateTime] = useState(getFormattedDateTime);

  function getFormattedDateTime() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    // Determine whether it's AM or PM
    const amOrPm = hours >= 12 ? 'pm' : 'am';

    // Convert hours from 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12;

    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, '0')} ${amOrPm}`;
    const formattedDate = `${month} ${day}`;

    return `${formattedDate} - ${formattedTime}`;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getFormattedDateTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return currentDateTime;
};
