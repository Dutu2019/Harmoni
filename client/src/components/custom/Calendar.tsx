import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface MonthViewProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

export const MonthView = ({ currentDate, onDateSelect, onMonthChange }: MonthViewProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {days.map((day) => (
          <button
            key={day.toString()}
            onClick={() => onDateSelect(day)}
            className={`
              p-2 text-center rounded-md transition-colors
              ${isToday(day) ? 'bg-primary text-primary-foreground' : ''}
              ${!isToday(day) && isSameMonth(day, currentDate) ? 'hover:bg-secondary' : ''}
              ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}
            `}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

interface TimeSlotsProps {
  selectedDate: Date;
  onTimeSelect: (time: Date) => void;
}

export const TimeSlots = ({ selectedDate, onTimeSelect }: TimeSlotsProps) => {
  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hours = i + 9;
    const time = new Date(selectedDate);
    time.setHours(hours, 0, 0, 0);
    return time;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available Times for {format(selectedDate, 'MMMM d, yyyy')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {timeSlots.map((time) => (
          <Button
            key={time.toString()}
            variant="outline"
            className="w-full"
            onClick={() => onTimeSelect(time)}
          >
            {format(time, 'h:mm a')}
          </Button>
        ))}
      </div>
    </div>
  );
};

interface BookingFormProps {
  selectedTime: Date;
  onClose: () => void;
}

export const BookingForm = ({ selectedTime, onClose }: BookingFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the booking to a backend
    toast({
      title: "Booking Confirmed!",
      description: `Your appointment has been scheduled for ${format(selectedTime, 'MMMM d, yyyy h:mm a')}`,
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" />
      </div>
      
      <div className="pt-4 space-x-2">
        <Button type="submit">Confirm Booking</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};