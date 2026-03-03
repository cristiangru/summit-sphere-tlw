// src/app/events/page.tsx
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";

// Mock data - replace with Supabase later
const mockEvents = [
  {
    id: "1",
    title: "Web Development Summit 2024",
    description: "Join us for the biggest web development conference of the year",
    date: "2024-03-15",
    location: "Bucharest, Romania",
    participants: 250,
    maxParticipants: 500,
  },
  {
    id: "2",
    title: "Health & Wellness Conference",
    description: "Explore the latest trends in health and wellness industry",
    date: "2024-04-20",
    location: "Hybrid - Online & In-Person",
    participants: 180,
    maxParticipants: 300,
  },
  {
    id: "3",
    title: "Business Growth Workshop",
    description: "Learn proven strategies to scale your business",
    date: "2024-05-10",
    location: "Bucharest, Romania",
    participants: 120,
    maxParticipants: 200,
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-slate-950 dark:to-slate-900 mt-30">
      {/* Navigation */}


      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#2D9A8F] hover:opacity-80 transition-opacity mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Choose an event and register today
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl hover:shadow-slate-300/20 dark:hover:shadow-slate-800/40 transition-all"
            >
              {/* Header with gradient background */}
              <div className="h-32 bg-gradient-to-r from-[#2D9A8F] to-emerald-400 p-6 flex flex-col justify-end">
                <h2 className="text-2xl font-bold text-white">
                  {event.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3 border-y border-slate-200 dark:border-slate-800 py-4">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-5 h-5 text-[#2D9A8F]" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString("ro-RO")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-5 h-5 text-[#2D9A8F]" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Users className="w-5 h-5 text-[#2D9A8F]" />
                    <span className="text-sm">
                      {event.participants} / {event.maxParticipants} registered
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2D9A8F] to-emerald-400"
                      style={{
                        width: `${(event.participants / event.maxParticipants) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {Math.round((event.participants / event.maxParticipants) * 100)}% full
                  </p>
                </div>

                {/* Register Button */}
                <Link
                  href={`/events/${event.id}`}
                  className="block w-full py-3 px-4 bg-[#2D9A8F] text-white font-bold rounded-lg hover:opacity-90 transition-all text-center group-hover:shadow-lg"
                >
                  View & Register
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No events fallback */}
        {mockEvents.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              No events available
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Check back soon for upcoming events
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#2D9A8F] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}