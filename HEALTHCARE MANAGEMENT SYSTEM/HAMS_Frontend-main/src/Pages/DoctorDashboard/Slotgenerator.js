export const generateTimeSlots = (interval) => {
  const slots = [];
  let start = new Date();
  start.setHours(9, 0, 0, 0); 

  const end = new Date();
  end.setHours(17, 0, 0, 0); 

  while (start < end) {
    const slot = start.toTimeString().substring(0, 5); 
    slots.push(slot);
    start = new Date(start.getTime() + interval * 60000); 
  }
  return slots;
};
