const DATABASE_KEY = 'neon-webmcp-database-v1';

export function createDatabase(storage = globalThis.localStorage) {
  let memory = { bookings: [] };
  const read = () => {
    if (!storage) return structuredClone(memory);
    try {
      const saved = JSON.parse(storage.getItem(DATABASE_KEY));
      return saved && Array.isArray(saved.bookings) ? saved : { bookings: [] };
    } catch {
      return { bookings: [] };
    }
  };
  const write = (value) => {
    memory = structuredClone(value);
    storage?.setItem(DATABASE_KEY, JSON.stringify(value));
    return structuredClone(value);
  };
  return {
    listBookings: () => read().bookings,
    saveBooking(booking) {
      const db = read();
      const existing = db.bookings.find((item) => item.reference === booking.reference);
      if (!existing) db.bookings.push(booking);
      return write(db).bookings.find((item) => item.reference === booking.reference);
    },
    reset() {
      storage?.removeItem(DATABASE_KEY);
      memory = { bookings: [] };
    },
  };
}
