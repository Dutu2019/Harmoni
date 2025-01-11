import { useState } from 'react';
import { MonthView } from '@/components/custom/Calendar';
import { TimeSlots } from '@/components/custom/Calendar';
import { BookingForm } from '@/components/custom/Calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
  };

  const handleCloseDialog = () => {
    setSelectedTime(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 relative p-4 md:p-8">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAzMGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptLTE4LTMwYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDMwYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')]"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Schedule an Appointment</h1>
          <p className="text-blue-100">
            Select a date and time that works best for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <MonthView
              currentDate={currentDate}
              onDateSelect={handleDateSelect}
              onMonthChange={setCurrentDate}
            />
          </div>

          <div>
            {selectedDate && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <TimeSlots
                  selectedDate={selectedDate}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            )}
          </div>
        </div>

        <Dialog open={!!selectedTime} onOpenChange={() => setSelectedTime(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Complete Your Booking</DialogTitle>
            </DialogHeader>
            {selectedTime && (
              <BookingForm
                selectedTime={selectedTime}
                onClose={handleCloseDialog}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Schedule;