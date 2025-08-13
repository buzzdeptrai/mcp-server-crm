export function search_booking({ name }) {
  const bookings = [
    { id: "B001", name: "Alice", room: "101", date: "2025-08-20" },
    { id: "B002", name: "Bob", room: "102", date: "2025-08-21" },
  ];
  return bookings.filter(b => b.name.toLowerCase().includes(name.toLowerCase()));
}

export function confirm_booking({ bookingId, guest }) {
  return {
    status: "confirmed",
    bookingId,
    guest,
    confirmedAt: new Date().toISOString()
  };
}
