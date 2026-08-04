import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Search, Clock, Tag, Trash2, Check } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: "Work" | "Personal" | "Meeting" | "Task";
  color: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "1", title: "ToolBox App Review", date: new Date().toISOString().split("T")[0], time: "10:00 AM", category: "Meeting", color: "#3B82F6" },
  { id: "2", title: "Project Sprint Demo", date: new Date().toISOString().split("T")[0], time: "02:30 PM", category: "Work", color: "#10B981" },
];

export const CalendarTool: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  
  // Event Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("09:00 AM");
  const [eventCategory, setEventCategory] = useState<"Work" | "Personal" | "Meeting" | "Task">("Work");

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthYearStr = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const colors: Record<string, string> = {
      Work: "#10B981",
      Meeting: "#3B82F6",
      Personal: "#8B5CF6",
      Task: "#F59E0B",
    };

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventTitle.trim(),
      date: selectedDate,
      time: eventTime,
      category: eventCategory,
      color: colors[eventCategory] || "#3B82F6",
    };

    setEvents([...events, newEvent]);
    setEventTitle("");
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const selectedDateEvents = events.filter((ev) => ev.date === selectedDate);

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-sky-500" /> Event Calendar
          </h3>
          <p className="text-xs text-slate-400">Interactive schedule, meetings & agenda manager</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">{monthYearStr}</h4>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 bg-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${dayNum.toString().padStart(2, "0")}`;

              const dayEvents = events.filter((ev) => ev.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-12 p-1 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                    isSelected
                      ? "bg-sky-500/20 border-sky-500 font-bold"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800"
                  }`}
                >
                  <span className={`text-xs font-mono ${isSelected ? "text-sky-400 font-bold" : "text-slate-300"}`}>
                    {dayNum}
                  </span>
                  <div className="flex gap-1 overflow-hidden">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: ev.color }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agenda for Selected Date */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-2">
            Schedule for {selectedDate}
          </span>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[360px] pr-1">
            {selectedDateEvents.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">No events scheduled for this day</p>
            ) : (
              selectedDateEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-8 rounded-full" style={{ backgroundColor: ev.color }} />
                    <div>
                      <h5 className="text-xs font-bold text-white">{ev.title}</h5>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" /> {ev.time} ({ev.category})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-sky-500" /> Schedule Event
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Sync Meeting"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Work">Work</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Personal">Personal</option>
                    <option value="Task">Task</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
